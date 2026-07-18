import api from '../../api/axios';

const CartService = {
    getCart: async () => {
        const res = await api.get('/api/cart');
        return res.data;
    },
    addItem: async (productId, quantity = 1) => {
        const res = await api.post('/api/cart/items', { productId, quantity });
        return res.data;
    },
    updateQuantity: async (itemId, quantity) => {
        const res = await api.put(`/api/cart/items/${itemId}?quantity=${quantity}`);
        return res.data;
    },
    removeItem: async (itemId) => {
        const res = await api.delete(`/api/cart/items/${itemId}`);
        return res.data;
    }
};

export default CartService;
