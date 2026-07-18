import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CartPage from '../modules/cart/pages/cart/CartPage';

export default function CartRoutes() {
    return (
        <Routes>
            <Route path="/" element={<CartPage />} />
        </Routes>
    );
}
