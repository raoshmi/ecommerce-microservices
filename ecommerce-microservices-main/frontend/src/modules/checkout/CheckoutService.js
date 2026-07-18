import api from '../../api/axios';

const CheckoutService = {
    initiateRazorpayPayment: async () => {
        const res = await api.post('/api/orders/razorpay/create');
        return res.data;
    },
    verifyRazorpayPayment: async (paymentDetails) => {
        const res = await api.post('/api/orders/razorpay/verify', paymentDetails);
        return res.data;
    },
    placeDemoOrder: async () => {
        const res = await api.post('/api/orders');
        return res.data;
    }
};

export default CheckoutService;
