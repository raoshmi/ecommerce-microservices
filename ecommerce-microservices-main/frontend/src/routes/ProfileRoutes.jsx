import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserProfilePage from '../modules/profile/pages/userProfile/UserProfilePage';

export default function ProfileRoutes() {
    return (
        <Routes>
            <Route path="/" element={<UserProfilePage />} />
        </Routes>
    );
}
