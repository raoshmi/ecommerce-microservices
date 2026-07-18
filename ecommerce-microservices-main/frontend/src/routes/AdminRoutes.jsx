import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboardPage from '../modules/admin/pages/adminDashboard/AdminDashboardPage';

export default function AdminRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboardPage />} />
        </Routes>
    );
}
