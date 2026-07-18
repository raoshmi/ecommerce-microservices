import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrdersPage from '../modules/orders/pages/orders/OrdersPage';

export default function OrderRoutes() {
    return (
        <Routes>
            <Route path="/" element={<OrdersPage />} />
        </Routes>
    );
}
