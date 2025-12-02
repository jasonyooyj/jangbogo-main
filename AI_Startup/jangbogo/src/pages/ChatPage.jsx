import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Plus, Navigation, ShoppingCart, MapPin } from 'lucide-react';
import { PRODUCTS, RECIPES } from '../data/mockData';
import { getChatResponse } from '../services/openai';
import { useCart } from '../contexts/CartContext';
import ProductLocationModal from '../components/products/ProductLocationModal';

export default function ChatPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: '안녕하세요! 스마트 카트 AI입니다. 무엇을 도와드릴까요? (예: "우유, 사과 어디 있어?", "떡볶이 어디 있어?", "스테이크 레시피 추천해줘")' }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNavigate = (products) => {
    // If single product, wrap in array
    const targetProducts = Array.isArray(products) ? products : [products];
    navigate('/map', { state: { targetProducts } });
  };

  const handleSend = (text = inputText) => {
    if (!text.trim()) return;

    // User Message
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // AI Response Logic
    (async () => {
      const aiResponse = await getChatResponse([
        ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: text }
      ]);

      // 레시피 ID가 있으면 레시피 재료 가져오기
      let recipe = null;
      let recipeProducts = [];
      if (aiResponse.recipeId) {
        recipe = RECIPES.find(r => r.id === aiResponse.recipeId);
        if (recipe && recipe.relatedProductIds) {
          recipeProducts = PRODUCTS.filter(p => recipe.relatedProductIds.includes(p.id));
          console.log('Recipe found:', recipe);
          console.log('Recipe products:', recipeProducts);
        }
      }

      // AI가 반환한 상품 ID로 실제 상품 객체 찾기
      let foundProducts = [];
      if (aiResponse.productIds && aiResponse.productIds.length > 0) {
        foundProducts = PRODUCTS.filter(p => aiResponse.productIds.includes(p.id));
        console.log('Products found from AI response IDs:', foundProducts);
      }

      // 레시피 재료가 있으면 우선 사용, 없으면 일반 상품 사용
      const finalProducts = recipeProducts.length > 0 ? recipeProducts : foundProducts;

      // 폴백: 키워드 매칭 (AI가 JSON을 반환하지 않은 경우)
      if (finalProducts.length === 0) {
        const keywordProducts = PRODUCTS.filter(p => aiResponse.text.includes(p.name));
        console.log('Products found from keyword matching (fallback):', keywordProducts);
        if (keywordProducts.length > 0) {
          foundProducts = keywordProducts;
        }
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: aiResponse.text,
        products: finalProducts.length > 0 ? finalProducts : foundProducts.length > 0 ? foundProducts : null,
        recipe: recipe || null
      };
      setMessages(prev => [...prev, botMsg]);
    })();
  };

  const handleOptionClick = (option) => {
    // User selection message
    const userMsg = { id: Date.now(), sender: 'user', text: option.label };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let botText = "";
      let recommendedProducts = [];

      if (option.value === 'ingredients') {
        // Find ingredients
        const ingredients = ['떡볶이 떡', '사각 어묵', '대파', '고추장'];
        recommendedProducts = PRODUCTS.filter(p => ingredients.some(ing => p.name.includes(ing)));
        botText = "떡볶이 재료(떡, 어묵, 대파, 고추장)의 위치를 모두 찾았습니다. 효율적인 동선을 안내해 드릴까요?";
      } else if (option.value === 'mealkit') {
        // Find meal kits
        const kits = ['떡볶이 밀키트', '즉석 떡볶이'];
        recommendedProducts = PRODUCTS.filter(p => kits.some(k => p.name.includes(k)));
        botText = "간편한 떡볶이 밀키트와 완제품 위치입니다. 안내해 드릴까요?";
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botText,
        products: recommendedProducts
      };
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white p-4 shadow-sm border-b flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce mx-[1px]"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce mx-[1px] delay-75"></div>
          </div>
          <div>
            <h2 className="font-bold text-gray-800">AI 쇼핑 어시스턴트</h2>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> 온라인
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

              {/* Options (Disambiguation) */}
              {msg.options && (
                <div className="mt-3 flex flex-col gap-2">
                  {msg.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt)}
                      className="text-sm bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-left font-medium"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Recipe Ingredients Cards */}
              {msg.recipe && msg.products && msg.products.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">필요한 재료:</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {msg.products.map((product) => {
                      const ingredient = msg.recipe.ingredients.find(ing =>
                        product.name.includes(ing.name) || ing.name.includes(product.name.split(' ')[0])
                      );
                      return (
                        <div key={product.id} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 border border-gray-200">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-12 h-12 rounded-lg bg-gray-200 hidden items-center justify-center text-2xl">
                            📦
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-sm text-gray-800 truncate">{product.name}</h5>
                                {ingredient && (
                                  <p className="text-xs text-orange-600 font-medium mt-0.5">필요: {ingredient.amount}</p>
                                )}
                                <p className="text-xs text-blue-600 font-bold mt-0.5">{product.price.toLocaleString()}원</p>
                                <p className="text-xs text-gray-500 mt-0.5">{product.section} 구역</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                                console.log('Added to cart:', product.name);
                              }}
                              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              title="장바구니 추가"
                            >
                              <ShoppingCart size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product);
                              }}
                              className="p-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                              title="위치 보기"
                            >
                              <MapPin size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Button (Navigation) */}
              {msg.products && msg.products.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100/20 flex gap-2">
                  <button
                    onClick={() => handleNavigate(msg.products)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 ${msg.sender === 'user' ? 'bg-white/20 hover:bg-white/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    <Navigation size={14} />
                    {msg.products.length > 1 ? `전체 경로 안내 (${msg.products.length}개)` : '안내 시작'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Product Location Modal */}
      {selectedProduct && (
        <ProductLocationModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Input Area */}
      <div className="bg-white p-4 border-t safe-area-bottom">
        <div className="flex gap-2">
          <button className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            <Plus size={20} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="상품 검색 또는 질문하기..."
              className="w-full h-full bg-gray-100 rounded-full pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button
              onClick={() => handleSend("오늘 저녁 메뉴 추천해줘")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Mic size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}