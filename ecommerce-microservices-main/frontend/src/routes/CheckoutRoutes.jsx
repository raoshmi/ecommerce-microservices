import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CheckoutPage from '../modules/checkout/pages/checkout/CheckoutPage';

export default function CheckoutRoutes() {
    return (
        <Routes>
            <Route path="/" element={<CheckoutPage />} />
        </Routes>
    );
}
