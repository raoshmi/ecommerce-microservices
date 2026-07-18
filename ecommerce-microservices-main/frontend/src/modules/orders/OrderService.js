import api from '../../api/axios';

const OrderService = {
    getOrders: async () => {
        const res = await api.get('/api/orders');
        return res.data;
    },
    getAdminStats: async () => {
        const res = await api.get('/api/orders/stats');
        return res.data;
    },
    placeOrder: async () => {
        const res = await api.post('/api/orders');
        return res.data;
    },
    createRazorpayOrder: async () => {
        const res = await api.post('/api/orders/razorpay/create');
        return res.data;
    },
    verifyRazorpayPayment: async (paymentDetails) => {
        const res = await api.post('/api/orders/razorpay/verify', paymentDetails);
        return res.data;
    }
};

export default OrderService;
