import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Map as MapIcon, ShoppingCart, Navigation } from 'lucide-react';

export default function MapPage() {
  const location = useLocation();
  // Support both single targetProduct (legacy) and targetProducts array
  const initialProducts = location.state?.targetProducts || (location.state?.targetProduct ? [location.state.targetProduct] : []);

  const [targetProducts, setTargetProducts] = useState(initialProducts);
  const [isMoving, setIsMoving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // For animating through products
  const userPos = useRef({ x: 50, y: 95 });
  const [customTarget, setCustomTarget] = useState(null); // 사용자 지정 목적지
  const mapRef = useRef(null);

  // 초기 상태 로그
  useEffect(() => {
    console.log('[MapPage] 진입 - initialProducts:', initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (targetProducts.length > 0) {
      console.log('[MapPage] 안내 시작 - targetProducts:', targetProducts);
      setIsMoving(true);
      // Simulate moving through products
      const stepDuration = 2000;
      const totalDuration = targetProducts.length * stepDuration;

      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev < targetProducts.length - 1 ? prev + 1 : prev;
          if (nextStep !== prev) {
            console.log('[MapPage] currentStep 변경:', nextStep, '->', targetProducts[nextStep]?.name);
          }
          if (prev < targetProducts.length - 1) return nextStep;
          return prev;
        });
      }, stepDuration);

      const timeout = setTimeout(() => {
        setIsMoving(false);
        console.log('[MapPage] 안내 종료');
        clearInterval(interval);
      }, totalDuration + 1000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    } else {
      console.log('[MapPage] 안내 대상 상품 없음 (targetProducts 비어 있음)');
    }
  }, [targetProducts]);

  // Determine current target for animation
  const activeTargetFromProducts = targetProducts[currentStep] || targetProducts[0];

  // 실제 카트 위치 결정: 사용자 지정 목적지가 있으면 우선 사용
  const cartPosition = customTarget
    ? { x: customTarget.x, y: customTarget.y }
    : activeTargetFromProducts && isMoving
      ? { x: activeTargetFromProducts.location.x, y: activeTargetFromProducts.location.y + 10 }
      : { x: userPos.current.x, y: userPos.current.y };

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
        <div className="px-4 pt-2 pb-1 bg-white border-b text-xs text-gray-600">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {targetProducts.map((p, index) => {
              const isActive = index === currentStep && !customTarget;
              return (
                <div
                  key={p.id}
                  className={`px-2 py-1 rounded-full border whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <span className="font-semibold mr-1">{index + 1}.</span>
                  <span>{p.name}</span>
                  <span className="ml-1 text-[10px] text-gray-300">{p.section}</span>
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
          {targetProducts.length > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Line from User to First Product */}
              <line
                x1={`${userPos.current.x}%`}
                y1={`${userPos.current.y}%`}
                x2={`${targetProducts[0].location.x}%`}
                y2={`${targetProducts[0].location.y}%`}
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="5,5"
                className="opacity-30"
              />
              {/* Lines between products */}
              {targetProducts.map((p, i) => {
                if (i === targetProducts.length - 1) return null;
                const next = targetProducts[i + 1];
                return (
                  <line
                    key={i}
                    x1={`${p.location.x}%`}
                    y1={`${p.location.y}%`}
                    x2={`${next.location.x}%`}
                    y2={`${next.location.y}%`}
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    className="opacity-30"
                  />
                );
              })}
            </svg>
          )}

          {/* 안내 대상이 없고 사용자 지정 목적지도 없을 때 빈 상태 안내 */}
          {targetProducts.length === 0 && !customTarget && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 text-sm px-6">
              <div className="mb-2 text-3xl">🗺️</div>
              <p className="font-semibold mb-1">안내 중인 상품이 없습니다.</p>
              <p className="text-xs">
                AI에게 상품을 물어보거나, 지도를 터치해서 직접 목적지를 설정해 보세요.
              </p>
            </div>
          )}
        </div>

        <div className="absolute bottom-6 left-0 w-full px-6 flex justify-center">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-xs text-gray-600 flex items-center gap-2">
            <Navigation size={12} />
            <span>{targetProducts.length > 1 ? '최적의 쇼핑 동선을 안내합니다.' : '지도를 터치하여 목적지를 직접 설정할 수도 있습니다.'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}