import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import RecipeCard from './RecipeCard';
import { RECIPES } from '../../data/mockData';

export default function RecipeSection() {
    const navigate = useNavigate();

    const handleRecipeClick = (recipe) => {
        console.log('[RecipeSection] 레시피 카드 클릭', {
            recipeId: recipe.id,
            title: recipe.title,
        });
        // 항상 레시피 상세 페이지로 이동하여 좌측에 영상, 우측에 재료/장바구니/위치 정보를 함께 보여줌
        navigate(`/recipe/${recipe.id}`);
    };

    return (
        <div className="px-6 mb-8">
            <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-800">오늘의 AI 레시피 추천 👨‍🍳</h2>
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-blue-500 font-medium">취향 저격</span>
                    <span className="text-[10px] text-gray-400 mt-1">
                        레시피를 누르면 재료를 한 번에 장바구니에 담을 수 있어요
                    </span>
                </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {RECIPES.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => handleRecipeClick(recipe)}
                    />
                ))}
            </div>
        </div>
    );
}
