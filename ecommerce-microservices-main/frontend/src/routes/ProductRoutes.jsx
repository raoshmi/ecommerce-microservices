import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductListPage from '../modules/product/pages/productList/ProductListPage';
import ProductList from '../modules/product/pages/product/ProductList';
import ProductForm from '../modules/product/pages/product/ProductForm';

export default function ProductRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="list" element={<ProductListPage />} />
            <Route path="manage" element={<ProductList />} />
            <Route path="add" element={<ProductForm />} />
            <Route path="edit/:id" element={<ProductForm />} />
        </Routes>
    );
}
