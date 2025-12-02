import React from 'react';
import { PlayCircle } from 'lucide-react';

export default function RecipeCard({ recipe, onClick }) {
    return (
        <div
            onClick={onClick}
            className="min-w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
        >
            <div className="relative h-40 overflow-hidden">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="text-white w-12 h-12" />
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{recipe.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{recipe.description}</p>
            </div>
        </div>
    );
}
