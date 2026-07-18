import api from '../../api/axios';

const AuthService = {
    login: async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        return res.data;
    },
    register: async (name, email, password) => {
        const res = await api.post('/api/auth/register', { name, email, password });
        return res.data;
    },
    getCurrentUser: async () => {
        const res = await api.get('/api/users/me');
        return res.data;
    }
};

export default AuthService;
