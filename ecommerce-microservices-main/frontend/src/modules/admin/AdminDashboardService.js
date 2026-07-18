import api from '../../api/axios';

const AdminDashboardService = {
    getStats: async () => {
        const [orderStats, productRes] = await Promise.all([
            api.get('/api/orders/stats'),
            api.get('/api/products?size=1')
        ]);
        return {
            orders: orderStats.data.totalOrders || 0,
            revenue: orderStats.data.totalRevenue || 0,
            products: productRes.data.totalElements || 0,
            users: 0 // Placeholder
        };
    }
};

export default AdminDashboardService;
