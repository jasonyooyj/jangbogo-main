import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import ChatPage from './pages/ChatPage';
import CartPage from './pages/CartPage';
import MenuPage from './pages/MenuPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="recipe/:id" element={<RecipeDetailPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}