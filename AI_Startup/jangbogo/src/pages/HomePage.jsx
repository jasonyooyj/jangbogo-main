import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MapIcon, Scan, Navigation, ChevronRight, ShoppingCart } from 'lucide-react';
import RecipeSection from '../components/recipes/RecipeSection';
import { PRODUCTS, RECOMMENDATIONS, PAST_PURCHASES } from '../data/mockData';
import { useCart } from '../contexts/CartContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (productId, imageUrl) => {
    console.error(`이미지 로드 실패: 상품 ID ${productId} - ${imageUrl}`);
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handleNavigate = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 pb-20">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-b-[2.5rem] shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">반갑습니다, 고객님! 👋</h1>
        <p className="opacity-90 text-sm mb-6">오늘도 스마트 카트와 함께 편안한 쇼핑 되세요.</p>

        <button
          onClick={() => navigate('/chat')}
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-sm">
            <Mic size={20} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">무엇을 찾으시나요?</p>
            <p className="text-xs opacity-70">"저녁 메뉴 추천해줘", "우유 위치 알려줘"</p>
          </div>
          <ChevronRight className="opacity-50" />
        </button>
      </div>

      {/* Recipe Section */}
      <RecipeSection />

      {/* Recommendation Section */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-gray-800">오늘의 AI 추천 상품 ✨</h2>
          <span className="text-xs text-blue-500 font-medium">구매 내역 기반</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {RECOMMENDATIONS.map((rec) => {
            const product = PRODUCTS.find(p => p.id === rec.id);
            return (
              <div
                key={rec.id}
                onClick={() => handleNavigate(product)}
                className="min-w-[200px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="h-24 bg-gray-100 rounded-xl mb-3 overflow-hidden">
                  {product.image && !imageErrors[product.id] ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain"
                      onError={() => handleImageError(product.id, product.image)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>
                <h3 className="font-bold text-gray-800">{rec.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{rec.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bold text-sm">{rec.discount} 할인</span>
                  <div
                    className="bg-blue-100 text-blue-600 p-2 rounded-lg"
                  >
                    <Navigation size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Purchase History Section */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-gray-800">지난 장보기 내역 🕒</h2>
          <span className="text-xs text-gray-500 font-medium">최근 구매일 순</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {PAST_PURCHASES.map((item) => (
            <div key={item.id} className="min-w-[160px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
              <div className="h-20 bg-gray-50 rounded-xl mb-3 overflow-hidden">
                {item.product.image && !imageErrors[item.product.id] ? (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-contain"
                    onError={() => handleImageError(item.product.id, item.product.image)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                )}
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{item.product.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{item.date} 구매</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold text-blue-600 text-sm">{item.product.price.toLocaleString()}원</span>
                <button
                  onClick={() => {
                    console.log('[지난 장보기] 장바구니 추가 클릭', {
                      productId: item.product.id,
                      name: item.product.name,
                      price: item.product.price,
                    });
                    addToCart(item.product);
                    alert(`${item.product.name}이(가) 장바구니에 담겼습니다.`);
                  }}
                  className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <ShoppingCart size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 grid grid-cols-2 gap-4">
        <button onClick={() => navigate('/map')} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <MapIcon size={24} />
          </div>
          <span className="font-bold text-gray-700">매장 지도 보기</span>
        </button>
        <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Scan size={24} />
          </div>
          <span className="font-bold text-gray-700">바코드 스캔</span>
        </button>
      </div>
    </div>
  );
}