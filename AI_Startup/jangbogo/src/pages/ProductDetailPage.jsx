import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Share2, Heart, ChevronRight } from 'lucide-react';
import { PRODUCTS, RECIPES } from '../data/mockData';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('description');
    const [imageError, setImageError] = useState(false);

    const product = PRODUCTS.find(p => p.id === parseInt(id));

    // Mock user history for demonstration
    const userRecipeHistory = [1]; // Assume user has viewed recipe ID 1

    // 간단 더미 데이터 (상품 공통 사용)
    const dummyReviews = [
        {
            id: 1,
            nickname: '홍*인',
            rating: 5,
            date: '2024.11.20',
            title: 'AI 추천이라서 반신반의했는데 만족이에요',
            content: '추천 목록에 떠서 한 번 담아봤는데, 신선도나 포장 상태 모두 만족스러웠어요. 재구매 의사 있습니다.'
        },
        {
            id: 2,
            nickname: '김*수',
            rating: 4,
            date: '2024.11.18',
            title: '가격 대비 괜찮아요',
            content: '동일 카테고리 다른 상품들이랑 비교했을 때 가격/품질 밸런스가 좋아요. 유통기한도 넉넉했습니다.'
        },
        {
            id: 3,
            nickname: '장*고',
            rating: 5,
            date: '2024.11.10',
            title: '장보고에서 자주 사는 상품입니다',
            content: '매장에서도 자주 사던 제품인데, 스마트 카트에서도 추천해줘서 편하게 담고 있어요.'
        }
    ];

    const dummyFaqs = [
        {
            id: 1,
            question: '유통기한은 어느 정도 남아 있는 상품으로 배송되나요?',
            answer: '일반적으로 수령일 기준 최소 5일 이상 남은 상품으로 출고되며, 신선 식품의 경우 당일/익일 생산분 위주로 발송됩니다.'
        },
        {
            id: 2,
            question: '냉장 보관이 꼭 필요한 제품인가요?',
            answer: '개봉 전에는 제품 뒷면에 표기된 보관 방법을 따르시면 되고, 개봉 후에는 0~10℃ 냉장 보관을 권장드립니다.'
        },
        {
            id: 3,
            question: '교환이나 환불은 어떻게 진행되나요?',
            answer: '상품에 문제가 있거나 파손된 경우, 수령일로부터 7일 이내 사진과 함께 문의를 남겨주시면 확인 후 교환/환불을 도와드립니다.'
        }
    ];

    if (!product) {
        return <div className="p-8 text-center">상품을 찾을 수 없습니다.</div>;
    }

    // Find related recipes
    const relatedRecipes = RECIPES.filter(recipe =>
        recipe.relatedProductIds && recipe.relatedProductIds.includes(product.id)
    );

    return (
        <div className="h-full bg-white overflow-y-auto pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center justify-between border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="font-bold text-lg truncate max-w-[200px]">{product.name}</h1>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Share2 size={24} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-full"><Heart size={24} /></button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Top: Product Info */}
                <div className="p-4 lg:p-8 flex flex-col lg:flex-row gap-6 border-b border-gray-100">
                    {/* Left: Image */}
                    <div className="lg:w-1/3">
                        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                            {product.image && !imageError ? (
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.error(`이미지 로드 실패: ${product.name} - ${product.image}`, e);
                                        setImageError(true);
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                            )}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="lg:w-2/3 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">{product.category}</span>
                            <div className="flex items-center text-yellow-400 text-xs">
                                <Star size={12} fill="currentColor" />
                                <span className="text-gray-500 ml-1">4.8 (120)</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                            신선하고 품질 좋은 {product.name}입니다. 다양한 요리에 활용해보세요.
                            오늘 주문하면 내일 새벽에 도착합니다.
                        </p>
                        <div className="text-2xl font-bold text-gray-900">
                            {product.price.toLocaleString()}원
                        </div>
                        <button
                            onClick={() => {
                                console.log('[ProductDetailPage] 위치찾기 클릭', {
                                    productId: product.id,
                                    name: product.name,
                                    section: product.section,
                                    location: product.location,
                                });
                                navigate('/map', { state: { targetProducts: [product] } });
                            }}
                            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                        >
                            매장 위치 찾기
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Middle: Recommended Recipes */}
                <div className="p-4 lg:p-8 bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <span>👨‍🍳</span> 이 상품으로 만드는 추천 레시피
                    </h3>

                    {relatedRecipes.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {relatedRecipes.map(recipe => {
                                const isViewed = userRecipeHistory.includes(recipe.id);
                                return (
                                    <div
                                        key={recipe.id}
                                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <div className="aspect-square bg-gray-200 relative">
                                            <img
                                                src={recipe.image}
                                                alt={recipe.title}
                                                className={`w-full h-full object-cover transition-all ${isViewed ? 'filter grayscale brightness-75' : ''}`}
                                            />
                                            {isViewed && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">봤던 레시피</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-bold text-sm text-gray-800 line-clamp-2">{recipe.title}</h4>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
                            <p>관련된 레시피가 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* Bottom: Tabs */}
                <div className="p-4 lg:p-8">
                    <div className="grid grid-cols-4 border-b border-gray-200 mb-6">
                        {['description', 'details', 'reviews', 'inquiry'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab === 'description' && '상품설명'}
                                {tab === 'details' && '상세정보'}
                                {tab === 'reviews' && '후기'}
                                {tab === 'inquiry' && '문의'}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[200px]">
                        {activeTab === 'description' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                                    <div className="bg-blue-50 text-blue-700 rounded-xl px-3 py-2">
                                        <p className="font-semibold mb-1">AI 추천 상품</p>
                                        <p className="text-[11px] sm:text-xs text-blue-600">
                                            최근 장보기 내역과 선호 카테고리를 기반으로 맞춤 추천된 상품입니다.
                                        </p>
                                    </div>
                                    <div className="bg-emerald-50 text-emerald-700 rounded-xl px-3 py-2">
                                        <p className="font-semibold mb-1">신선도/품질 관리</p>
                                        <p className="text-[11px] sm:text-xs text-emerald-600">
                                            입고부터 배송까지 콜드체인으로 관리되며, 기준에 미달하는 상품은 자동으로 제외됩니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                                    <p>
                                        <span className="font-semibold">{product.name}</span>은(는) 장보고에서
                                        자주 구매되는 인기 상품으로, 일상적인 장보기부터 특별한 날 상차림까지
                                        두루 활용하기 좋은 구성입니다.
                                    </p>
                                    <p>
                                        제품 특성에 맞춰 최적의 온도와 습도로 보관되며, 빠르게 회전되는 재고 정책으로
                                        보다 신선한 상태의 상품만 선별해 드립니다. 수요가 많은 시간대에도
                                        재고를 안정적으로 확보하여 품절 가능성을 낮췄습니다.
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                        <li>오늘 주문 시, 상황에 따라 새벽 배송 또는 익일 배송으로 받아보실 수 있습니다.</li>
                                        <li>레시피 추천 기능과 연동되어, 함께 구매하면 좋은 상품도 함께 안내해 드립니다.</li>
                                        <li>매장 지도를 통해 현재 진열 위치를 바로 확인하고, 스마트 카트로 길 안내를 받을 수 있습니다.</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 text-sm text-gray-700">
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                    <div className="text-gray-400">제품명</div>
                                    <div className="font-medium text-gray-800">{product.name}</div>

                                    <div className="text-gray-400">카테고리</div>
                                    <div>{product.category || '일반 식품'}</div>

                                    <div className="text-gray-400">보관 방법</div>
                                    <div>
                                        {product.category === 'Dairy' || product.category === 'Meat'
                                            ? '0~10℃ 냉장 보관'
                                            : '직사광선을 피하고 서늘한 곳에 보관'}
                                    </div>

                                    <div className="text-gray-400">유통기한</div>
                                    <div>수령일 기준 최소 5일 이상 남은 상품으로 출고</div>

                                    <div className="text-gray-400">원산지</div>
                                    <div>
                                        {product.category === 'Produce'
                                            ? '국내산 (산지 수시 변경)'
                                            : '상세 페이지 또는 상품 포장 뒷면 참고'}
                                    </div>

                                    <div className="text-gray-400">알레르기 정보</div>
                                    <div>우유, 밀, 대두, 견과류 등 알레르기 유발 성분이 포함될 수 있습니다.</div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    위 정보는 이해를 돕기 위한 더미 데이터입니다. 실제 매장/온라인몰에서는 상품 뒷면
                                    또는 상세 안내 페이지의 정보를 반드시 확인해 주세요.
                                </p>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-4">
                                <div className="flex items-baseline justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star size={18} className="text-yellow-400" fill="currentColor" />
                                        <span className="font-semibold text-gray-800 text-sm">4.8</span>
                                        <span className="text-xs text-gray-400 ml-1">({dummyReviews.length}개 더미 후기)</span>
                                    </div>
                                    <span className="text-xs text-gray-400">실제 후기 UI 예시용 더미 데이터</span>
                                </div>
                                <div className="space-y-3">
                                    {dummyReviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-700"
                                        >
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-800">{review.nickname}</span>
                                                    <span className="text-[11px] text-gray-400">{review.date}</span>
                                                </div>
                                                <div className="flex items-center gap-0.5 text-yellow-400 text-xs">
                                                    {Array.from({ length: 5 }).map((_, idx) => (
                                                        <Star
                                                            key={idx}
                                                            size={12}
                                                            className={idx < review.rating ? 'text-yellow-400' : 'text-gray-200'}
                                                            fill={idx < review.rating ? 'currentColor' : 'none'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="font-medium mb-0.5">{review.title}</p>
                                            <p className="text-xs text-gray-600 leading-relaxed">{review.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'inquiry' && (
                            <div className="space-y-6 text-sm text-gray-700">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">자주 묻는 질문</h4>
                                    <div className="space-y-3">
                                        {dummyFaqs.map((faq) => (
                                            <div key={faq.id} className="bg-gray-50 rounded-2xl px-4 py-3">
                                                <p className="font-medium mb-1">Q. {faq.question}</p>
                                                <p className="text-xs text-gray-600 leading-relaxed">A. {faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-xs text-gray-500 mb-2">
                                        아래 버튼은 문의 UX를 보여주기 위한 더미 동작입니다. 실제 문의 접수는 연결되어 있지 않습니다.
                                    </p>
                                    <button
                                        onClick={() => {
                                            console.log('[ProductDetailPage] 문의 남기기 클릭', {
                                                productId: product.id,
                                                name: product.name,
                                            });
                                            alert('데모 환경에서는 실제 문의 접수가 되지 않습니다.\n실 서비스에서는 이 영역에서 1:1 문의를 남길 수 있습니다.');
                                        }}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        1:1 문의 남기기
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
                <div className="max-w-7xl mx-auto flex gap-3">
                    <button className="flex-1 bg-white border border-blue-600 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
                        장바구니
                    </button>
                    <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                        구매하기
                    </button>
                </div>
            </div>
        </div>
    );
}
