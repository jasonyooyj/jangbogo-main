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
                            <div className="space-y-4">
                                <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-500">
                                    상품 상세 설명 이미지가 들어가는 영역입니다.
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    이 상품은 엄선된 농가에서 재배된 신선한 재료입니다.
                                    철저한 품질 관리를 통해 고객님 식탁까지 안전하게 배송됩니다.
                                </p>
                            </div>
                        )}
                        {activeTab !== 'description' && (
                            <div className="text-center py-10 text-gray-400">
                                준비 중인 컨텐츠입니다.
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
