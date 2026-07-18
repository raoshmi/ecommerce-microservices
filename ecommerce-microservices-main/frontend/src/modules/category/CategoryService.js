import api from '../../api/axios';

const CategoryService = {
    getAllCategories: async () => {
        const res = await api.get('/api/categories');
        return res.data;
    },
    getCategoryById: async (id) => {
        const res = await api.get(`/api/categories/${id}`);
        return res.data;
    },
    createCategory: async (category) => {
        const res = await api.post('/api/categories', category);
        return res.data;
    },
    updateCategory: async (id, category) => {
        const res = await api.put(`/api/categories/${id}`, category);
        return res.data;
    },
    deleteCategory: async (id) => {
        await api.delete(`/api/categories/${id}`);
    }
};

export default CategoryService;
