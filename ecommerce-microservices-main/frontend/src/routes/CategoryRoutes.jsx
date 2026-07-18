import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CategoryList from '../modules/category/pages/category/CategoryList';
import CategoryForm from '../modules/category/pages/category/CategoryForm';

export default function CategoryRoutes() {
    return (
        <Routes>
            <Route path="list" element={<CategoryList />} />
            <Route path="add" element={<CategoryForm />} />
            <Route path="edit/:id" element={<CategoryForm />} />
        </Routes>
    );
}
