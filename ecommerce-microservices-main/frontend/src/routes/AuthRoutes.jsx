import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/login/LoginPage';
import RegisterPage from '../modules/auth/pages/register/RegisterPage';

export default function AuthRoutes() {
    return (
        <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
        </Routes>
    );
}
