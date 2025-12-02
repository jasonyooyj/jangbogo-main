import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import RecipeCard from './RecipeCard';
import { RECIPES } from '../../data/mockData';

export default function RecipeSection() {
    const navigate = useNavigate();

    const handleRecipeClick = (recipe) => {
        // YouTube 링크가 있으면 YouTube로 이동, 없으면 Detail Page로 이동
        if (recipe.videoUrl) {
            window.open(recipe.videoUrl, '_blank');
        } else {
            navigate(`/recipe/${recipe.id}`);
        }
    };

    return (
        <div className="px-6 mb-8">
            <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-800">오늘의 AI 레시피 추천 👨‍🍳</h2>
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                </div>
                <span className="text-xs text-blue-500 font-medium">취향 저격</span>
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
