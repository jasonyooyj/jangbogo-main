import React from 'react';
import { X, MapPin } from 'lucide-react';

export default function ProductLocationModal({ product, onClose }) {
    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-up">
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <h3 className="font-bold text-lg">상품 위치 안내</h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-4xl">
                        📦
                    </div>

                    <h4 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h4>
                    <p className="text-gray-500 mb-6">{product.category}</p>

                    <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                        <div className="flex items-center justify-center gap-2 text-blue-600 font-bold text-lg mb-2">
                            <MapPin size={24} />
                            <span>{product.section} 구역</span>
                        </div>
                        <p className="text-sm text-gray-400">매장 입구 기준 우측 3번째 진열대</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
