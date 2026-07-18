import api from '../../api/axios';

const ProductService = {
    getProducts: async (search = '', category = '', minPrice = '', maxPrice = '', page = 0, size = 10) => {
        let url = `/api/products?page=${page}&size=${size}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        const res = await api.get(url);
        return res.data;
    },
    getProductById: async (id) => {
        const res = await api.get(`/api/products/${id}`);
        return res.data;
    },
    getRecommendations: async (userId) => {
        const res = await api.get(`/api/products/recommendations?userId=${userId || ''}`);
        return res.data;
    },
    getRecommendationsByProductId: async (productId) => {
        const res = await api.get(`/api/recommendations/${productId}`);
        return res.data;
    },
    createProduct: async (product) => {
        const res = await api.post('/api/products', product);
        return res.data;
    },
    updateProduct: async (id, product) => {
        const res = await api.put(`/api/products/${id}`, product);
        return res.data;
    },
    deleteProduct: async (id) => {
        await api.delete(`/api/products/${id}`);
    }
};

export default ProductService;
