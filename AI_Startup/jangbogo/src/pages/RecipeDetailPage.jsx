import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, MapPin, Plus, Minus, Users, Check } from 'lucide-react';
import { RECIPES, PRODUCTS } from '../data/mockData';
import { useCart } from '../contexts/CartContext';
import ProductLocationModal from '../components/products/ProductLocationModal';

export default function RecipeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [servings, setServings] = useState(2); // Default 2 servings (모든 스케일 계산의 기준)
    const [selectedItems, setSelectedItems] = useState(new Set());

    const recipe = RECIPES.find(r => r.id === parseInt(id));

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    const adjustServings = (delta) => {
        const newServings = servings + delta;
        if (newServings >= 1) {
            console.log('[RecipeDetailPage] 인분 변경', {
                before: servings,
                after: newServings,
            });
            setServings(newServings);
        }
    };

    // 기준 인분 (재료 스케일과 동일하게 2인분 기준)
    const BASE_SERVINGS = 2;

    // Helper to calculate ingredient amount
    const getAmount = (baseAmount) => {
        // Simple heuristic: if it contains a number, scale it.
        // Real implementation would need structured data (value, unit).
        const match = baseAmount.match(/(\d+)(\D+)/);
        if (match) {
            const val = parseInt(match[1]);
            const unit = match[2];
            const scaled = Math.round((val / BASE_SERVINGS) * servings * 10) / 10;
            return `${scaled}${unit}`;
        }
        return baseAmount; // Fallback for non-numeric amounts like "Salt to taste"
    };

    // Helper to calculate scaled price by servings
    const getScaledPrice = (basePrice) => {
        const scaled = Math.round((basePrice / BASE_SERVINGS) * servings);
        return scaled;
    };

    // Merge products with ingredients (memoized to prevent unnecessary recalculations)
    const mergedItems = useMemo(() => {
        if (!recipe || !recipe.relatedProductIds) return [];
        return recipe.relatedProductIds.map(id => {
            const product = PRODUCTS.find(p => p.id === id);
            if (!product) return null;

            // Find matching ingredient to show amount
            const matchingIngredient = recipe.ingredients.find(ing =>
                product.name.includes(ing.name) || ing.name.includes(product.name)
            );

            return {
                ...product,
                requiredAmount: matchingIngredient ? getAmount(matchingIngredient.amount) : null
            };
        }).filter(Boolean);
    }, [recipe, servings]); // Recalculate when recipe or servings change

    // Initialize selection when mergedItems change
    useEffect(() => {
        if (mergedItems.length > 0) {
            console.log('[RecipeDetailPage] 선택 항목 초기화', {
                recipeId: recipe?.id,
                mergedItemsCount: mergedItems.length,
                itemIds: mergedItems.map(i => i.id),
            });
            setSelectedItems(new Set(mergedItems.map(i => i.id)));
        }
    }, [mergedItems]); // Re-select when mergedItems changes

    const toggleSelection = (productId) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(productId)) {
            newSet.delete(productId);
        } else {
            newSet.add(productId);
        }
        setSelectedItems(newSet);
    };

    const handleBulkAdd = () => {
        const itemsToAdd = mergedItems.filter(item => selectedItems.has(item.id));
        console.log('[RecipeDetailPage] 장바구니 담기 클릭', {
            recipeId: recipe.id,
            title: recipe.title,
            selectedCount: itemsToAdd.length,
            itemIds: itemsToAdd.map(i => i.id),
        });
        itemsToAdd.forEach(item => {
            const scaledPrice = getScaledPrice(item.price);
            console.log('[RecipeDetailPage] 인분 스케일 적용 후 장바구니 추가', {
                productId: item.id,
                name: item.name,
                basePrice: item.price,
                servings,
                scaledPrice,
            });
            addToCart({
                ...item,
                price: scaledPrice,
            });
        });
        // Optional: Show toast or feedback
        alert(`${itemsToAdd.length}개 상품이 장바구니에 담겼습니다.`);
    };

    const handleNavigateProduct = (product) => {
        if (!product?.location) {
            console.warn('[RecipeDetailPage] 위치 정보 없음 - 길안내 불가', { productId: product?.id, name: product?.name });
            alert('해당 상품의 위치 정보가 없어 길안내를 제공할 수 없습니다.');
            return;
        }
        console.log('[RecipeDetailPage] 위치 안내 모달 → 길안내 시작', {
            productId: product.id,
            name: product.name,
            section: product.section,
            location: product.location,
        });
        navigate('/map', { state: { targetProducts: [product] } });
        setSelectedProduct(null);
    };

    const handleSelectAll = () => {
        if (selectedItems.size === mergedItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(mergedItems.map(i => i.id)));
        }
    };

    // Find ingredients that don't have a matching product (optional, for completeness)
    const unmatchedIngredients = recipe.ingredients.filter(ing =>
        !mergedItems.some(item => item.name.includes(ing.name) || ing.name.includes(item.name))
    );

    return (
        <div className="h-full bg-white overflow-y-auto pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-3 flex items-center gap-4 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="font-bold text-lg truncate">{recipe.title}</h1>
            </div>

            <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Video */}
                    <div className="lg:w-1/2">
                        <div className="sticky top-24">
                            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-4">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={recipe.embedUrl || recipe.videoUrl}
                                    title={recipe.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2 hidden lg:block">{recipe.title}</h2>
                            <p className="text-gray-600 leading-relaxed hidden lg:block">{recipe.description}</p>
                        </div>
                    </div>

                    {/* Right Column: Info & Ingredients */}
                    <div className="lg:w-1/2 space-y-6">
                        {/* Mobile Title/Desc */}
                        <div className="lg:hidden">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.title}</h2>
                            <p className="text-gray-600 leading-relaxed">{recipe.description}</p>
                        </div>

                        {/* Servings Selector */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2 text-gray-700 font-bold">
                                <Users size={20} className="text-blue-600" />
                                <span>인분 수</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => adjustServings(-1)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
                                    disabled={servings <= 1}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold text-lg min-w-[4rem] text-center whitespace-nowrap">{servings}인분</span>
                                <button
                                    onClick={() => adjustServings(1)}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Unified Ingredients & Purchase List */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                    <span>🛒</span> 재료 한 번에 담기
                                </h3>
                                <button
                                    onClick={handleSelectAll}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedItems.size === mergedItems.length && mergedItems.length > 0 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                                        {selectedItems.size === mergedItems.length && mergedItems.length > 0 && <Check size={12} strokeWidth={3} />}
                                    </div>
                                    전체 선택
                                </button>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                {mergedItems.map((item, idx) => (
                                    <div key={item.id} className={`flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 ${selectedItems.has(item.id) ? 'bg-blue-50/30' : ''}`}>
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => toggleSelection(item.id)}
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedItems.has(item.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-transparent'}`}
                                        >
                                            <Check size={14} strokeWidth={3} />
                                        </button>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-800">{item.name}</h4>
                                                {item.requiredAmount && (
                                                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                                        필요: {item.requiredAmount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-blue-600 font-bold mt-1">
                                                {getScaledPrice(item.price).toLocaleString()}원
                                            </p>
                                        </div>

                                        {/* Location Button */}
                                        <button
                                            onClick={() => setSelectedProduct(item)}
                                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                                        >
                                            <MapPin size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Unmatched Ingredients (Optional) */}
                        {unmatchedIngredients.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-sm font-bold text-gray-600 mb-2">기타 필요 재료 (상품 정보 없음)</h4>
                                <ul className="space-y-1">
                                    {unmatchedIngredients.map((ing, idx) => (
                                        <li key={idx} className="text-sm text-gray-500 flex justify-between">
                                            <span>{ing.name}</span>
                                            <span>{getAmount(ing.amount)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Floating Bar - Footer(특히 AI 대화 아이콘)를 덮지 않도록 z-index는 Footer보다 낮게 유지 */}
            <div className="fixed bottom-20 left-0 w-full bg-white border-t border-gray-200 p-4 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                        총 <span className="font-bold text-blue-600">{selectedItems.size}</span>개 선택됨
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            console.log('[RecipeDetailPage] 장바구니로 이동 클릭', {
                                recipeId: recipe.id,
                                title: recipe.title,
                            });
                            navigate('/cart');
                        }}
                        className="px-3 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                    >
                        장바구니로 이동
                    </button>
                    <button
                        onClick={handleBulkAdd}
                        disabled={selectedItems.size === 0}
                        className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={20} />
                        장바구니 담기
                    </button>
                </div>
            </div>

            {/* Location Modal */}
            {selectedProduct && (
                <ProductLocationModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onNavigate={handleNavigateProduct}
                />
            )}
        </div>
    );
}
