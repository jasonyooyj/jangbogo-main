import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Map as MapIcon, ShoppingCart, Navigation } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function MapPage() {
  const SECTION_RECTS = [
    { name: 'A', rect: { x1: 10, y1: 10, x2: 45, y2: 30 } }, // 신선식품
    { name: 'A2', rect: { x1: 55, y1: 10, x2: 90, y2: 30 } }, // 정육/수산
    { name: 'B', rect: { x1: 10, y1: 40, x2: 30, y2: 70 } }, // 베이커리
    { name: 'C', rect: { x1: 40, y1: 40, x2: 60, y2: 70 } }, // 유제품
    { name: 'D', rect: { x1: 70, y1: 40, x2: 90, y2: 70 } }, // 스낵/음료
  ];
  const GRID_STEPS = 40; // 격자 해상도 (값이 높을수록 경로가 부드러움)
  const GRID_STEP_SIZE = 100 / GRID_STEPS;

  const location = useLocation();
  const { addToCart } = useCart();
  // Support both single targetProduct (legacy) and targetProducts array
  const initialProducts = location.state?.targetProducts || (location.state?.targetProduct ? [location.state.targetProduct] : []);

  const [targetProducts, setTargetProducts] = useState(initialProducts);
  const [isMoving, setIsMoving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // For animating through products
  const userPos = useRef({ x: 50, y: 95 });
  const [customTarget, setCustomTarget] = useState(null); // 사용자 지정 목적지
  const mapRef = useRef(null);
  const [pathPoints, setPathPoints] = useState([{ ...userPos.current }]);
  const [pathIndex, setPathIndex] = useState(0);
  const [arrivalIndices, setArrivalIndices] = useState([]); // 각 목적지 도달 지점 인덱스

  // 초기 상태 로그
  useEffect(() => {
    console.log('[MapPage] 진입 - initialProducts:', initialProducts);
  }, [initialProducts]);

  const clampPct = (v) => Math.min(100, Math.max(0, v));

  const pointInRect = (point, rect) =>
    point.x >= rect.x1 &&
    point.x <= rect.x2 &&
    point.y >= rect.y1 &&
    point.y <= rect.y2;

  const padRect = (rect, pad = 1.5) => ({
    x1: clampPct(rect.x1 - pad),
    y1: clampPct(rect.y1 - pad),
    x2: clampPct(rect.x2 + pad),
    y2: clampPct(rect.y2 + pad),
  });

  const findSectionByPoint = (point) => SECTION_RECTS.find((s) => pointInRect(point, s.rect));

  const isPointBlocked = (point, allowedSectionName) =>
    SECTION_RECTS.some((section) => {
      if (allowedSectionName && section.name === allowedSectionName) return false; // 목적지 섹션은 통과 허용
      const padded = padRect(section.rect, 1.5);
      return pointInRect(point, padded);
    });

  const toCell = (point) => ({
    cx: Math.min(GRID_STEPS, Math.max(0, Math.round(point.x / GRID_STEP_SIZE))),
    cy: Math.min(GRID_STEPS, Math.max(0, Math.round(point.y / GRID_STEP_SIZE))),
  });

  const toPoint = (cell) => ({
    x: clampPct(cell.cx * GRID_STEP_SIZE),
    y: clampPct(cell.cy * GRID_STEP_SIZE),
  });

  const findPath = (startPoint, endPoint) => {
    const allowedSection = findSectionByPoint(endPoint);
    const start = toCell(startPoint);
    const target = toCell(endPoint);
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const key = (cell) => `${cell.cx},${cell.cy}`;
    const visited = new Set([key(start)]);
    const prev = new Map();
    const queue = [start];
    let found = false;

    while (queue.length) {
      const cur = queue.shift();
      if (cur.cx === target.cx && cur.cy === target.cy) {
        found = true;
        break;
      }
      directions.forEach(([dx, dy]) => {
        const next = { cx: cur.cx + dx, cy: cur.cy + dy };
        if (next.cx < 0 || next.cy < 0 || next.cx > GRID_STEPS || next.cy > GRID_STEPS) return;
        const k = key(next);
        if (visited.has(k)) return;
        const nextPoint = toPoint(next);
        if (isPointBlocked(nextPoint, allowedSection?.name)) return;
        visited.add(k);
        prev.set(k, cur);
        queue.push(next);
      });
    }

    if (!found) {
      console.warn('[MapPage] 경로 계산 실패 - 직선 경로로 폴백', { from: startPoint, to: endPoint });
      return [];
    }

    const path = [];
    let cur = target;
    while (cur) {
      path.push(toPoint(cur));
      const k = key(cur);
      const p = prev.get(k);
      if (!p) break;
      cur = p;
    }
    return path.reverse();
  };

  // 목적지 경로 재계산
  useEffect(() => {
    const targets = customTarget ? [{ location: customTarget, name: '사용자 지정 위치' }] : targetProducts;
    if (!targets || targets.length === 0) {
      console.log('[MapPage] 안내 대상 없음 - path 초기화');
      setPathPoints([{ ...userPos.current }]);
      setArrivalIndices([]);
      setPathIndex(0);
      setCurrentStep(0);
      setIsMoving(false);
      return;
    }

    let cursor = { ...userPos.current };
    const points = [{ ...cursor }];
    const arrivals = [];

    targets.forEach((t, idx) => {
      const dest = t.location || t; // customTarget는 location이 없음
      const segment = findPath(cursor, dest);
      const usable = segment.length > 0 ? segment : [cursor, dest];
      points.push(...usable.slice(1));
      arrivals.push(points.length - 1);
      cursor = dest;
      if (segment.length === 0) {
        console.warn('[MapPage] 경로 계산 실패: 섹션을 우회하지 못해 직선 사용', { target: t.name || 'custom', index: idx });
      }
    });

    setPathPoints(points);
    setArrivalIndices(arrivals);
    setPathIndex(0);
    setCurrentStep(0);
    setIsMoving(true);
    console.log('[MapPage] 경로 재계산 완료', {
      waypointCount: points.length,
      destinations: targets.length,
      arrivals,
      customTarget: !!customTarget,
    });
  }, [targetProducts, customTarget]);

  // 경로를 따라 이동 애니메이션
  useEffect(() => {
    if (pathPoints.length <= 1) return undefined;
    const interval = setInterval(() => {
      setPathIndex((prev) => {
        if (prev >= pathPoints.length - 1) return prev;
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [pathPoints]);

  // 현재 단계 및 이동 상태 업데이트
  useEffect(() => {
    if (pathPoints.length === 0) return;
    if (pathIndex >= pathPoints.length - 1 && isMoving) {
      console.log('[MapPage] 안내 종료 - 경로 완료');
      setIsMoving(false);
    }

    if (arrivalIndices.length > 0) {
      const reached = arrivalIndices.findIndex((idx) => pathIndex <= idx);
      const nextStep = reached === -1 ? arrivalIndices.length - 1 : Math.max(0, reached);
      if (nextStep !== currentStep) {
        console.log('[MapPage] currentStep 변경:', currentStep, '->', nextStep);
        setCurrentStep(nextStep);
      }
    }
  }, [pathIndex, pathPoints.length, arrivalIndices, currentStep, isMoving]);

  // Determine current target for animation
  const activeTargetFromProducts = targetProducts[currentStep] || targetProducts[0];

  // 실제 카트 위치 결정: 사용자 지정 목적지가 있으면 우선 사용
  const cartPosition = pathPoints[pathIndex] || { x: userPos.current.x, y: userPos.current.y };

  const handleMapClick = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.min(Math.max(x, 0), 100);
    const clampedY = Math.min(Math.max(y, 0), 100);

    const nextCustomTarget = { x: clampedX, y: clampedY };
    setCustomTarget(nextCustomTarget);
    console.log('[MapPage] 사용자 지정 목적지 설정:', nextCustomTarget);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Map Header Info */}
      <div className="p-4 bg-white border-b z-10 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">매장 실내 지도</h2>
          <p className="text-xs text-gray-500">현재 위치: 중앙 입구</p>
        </div>
        {targetProducts.length > 0 && (
          <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <span className="text-sm font-semibold text-blue-700">
              {targetProducts.length > 1
                ? `안내 중: ${targetProducts.length}개 품목`
                : `안내 중: ${targetProducts[0].name} (${targetProducts[0].section})`}
            </span>
          </div>
        )}
      </div>

      {/* 현재 안내 상품 리스트 (간단 요약) */}
      {targetProducts.length > 0 && (
        <div className="px-4 pt-2 pb-2 bg-white border-b">
          <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
            {targetProducts.map((p, index) => {
              const isActive = index === currentStep && !customTarget;
              return (
                <div
                  key={p.id}
                  className={`px-2 py-1 rounded-full border whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <span className="font-semibold mr-1">{index + 1}.</span>
                  <span className="text-xs">{p.name}</span>
                  <span className="ml-1 text-[10px] text-gray-300">{p.section}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('[MapPage] 장바구니 추가 클릭', {
                        productId: p.id,
                        name: p.name,
                        price: p.price,
                      });
                      addToCart(p);
                      alert(`${p.name}이(가) 장바구니에 담겼습니다.`);
                    }}
                    className={`ml-1 p-1 rounded hover:opacity-80 transition-opacity ${
                      isActive
                        ? 'bg-white/20 hover:bg-white/30'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    title="장바구니에 담기"
                  >
                    <ShoppingCart size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Map Canvas Area */}
      <div className="flex-1 bg-gray-50 relative overflow-hidden p-6 flex items-center justify-center">
        <div
          ref={mapRef}
          className="relative w-full max-w-lg aspect-square bg-white rounded-xl border-2 border-gray-200 shadow-inner p-4"
          onClick={handleMapClick}
        >

          {/* Grid Lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          {/* Store Layout */}
          <div className="absolute top-[10%] left-[10%] w-[35%] h-[20%] bg-green-100 border border-green-300 rounded flex items-center justify-center text-green-800 font-bold text-xs">신선식품 (A)</div>
          <div className="absolute top-[10%] right-[10%] w-[35%] h-[20%] bg-red-100 border border-red-300 rounded flex items-center justify-center text-red-800 font-bold text-xs">정육/수산 (A2)</div>
          <div className="absolute top-[40%] left-[10%] w-[20%] h-[30%] bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center text-yellow-800 font-bold text-xs">베이커리 (B)</div>
          <div className="absolute top-[40%] left-[40%] w-[20%] h-[30%] bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-blue-800 font-bold text-xs">유제품 (C)</div>
          <div className="absolute top-[40%] right-[10%] w-[20%] h-[30%] bg-purple-100 border border-purple-300 rounded flex items-center justify-center text-purple-800 font-bold text-xs">스낵/음료 (D)</div>

          {/* Target Markers */}
          {targetProducts.map((product, index) => (
            <div
              key={product.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
              style={{ left: `${product.location.x}%`, top: `${product.location.y}%` }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white z-20 ${index === currentStep && isMoving ? 'bg-red-500 animate-bounce scale-110' : 'bg-gray-400'}`}>
                <span className="font-bold text-xs">{index + 1}</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded mt-1 whitespace-nowrap z-20">
                {product.name}
              </div>
            </div>
          ))}

          {/* 사용자 지정 목적지 마커 */}
          {customTarget && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 z-20"
              style={{ left: `${customTarget.x}%`, top: `${customTarget.y}%` }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-yellow-500 bg-yellow-100 shadow-lg border-2 border-yellow-400">
                <MapIcon size={16} />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-[10px] px-2 py-1 rounded mt-1 whitespace-nowrap">
                사용자 지정 위치
              </div>
            </div>
          )}

          {/* Current User Cart Marker */}
          <div
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[2000ms] ease-in-out z-30`}
            style={{
              left: `${cartPosition.x}%`,
              top: `${cartPosition.y}%`
            }}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-blue-200">
              <ShoppingCart size={18} />
            </div>
            {(isMoving || customTarget) && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                {customTarget ? '사용자 지정 위치로 이동 중' : '자율 주행 중...'}
              </div>
            )}
          </div>

          {/* Path Visualization (Simplified: User -> P1 -> P2...) */}
          {pathPoints.length > 1 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polyline
                points={pathPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.8"
                strokeDasharray="4 3"
                opacity="0.6"
              />
            </svg>
          )}
        </div>

        <div className="absolute bottom-6 left-0 w-full px-6 flex justify-center">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-xs text-gray-600 flex items-center gap-2">
            <Navigation size={12} />
            <span>
              {targetProducts.length === 0
                ? '안내 중인 상품이 없습니다. 지도를 터치해서 직접 목적지를 설정해 보세요.'
                : targetProducts.length > 1
                  ? '최적의 쇼핑 동선을 안내합니다.'
                  : '선택한 상품까지 이동 경로를 안내합니다.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}