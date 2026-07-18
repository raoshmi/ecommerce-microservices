import api from '../../api/axios';

const UserProfileService = {
    getProfile: async () => {
        const res = await api.get('/api/users/me');
        return res.data;
    },
    updateProfile: async (profileData) => {
        const res = await api.put('/api/users/profile', profileData);
        return res.data;
    }
};

export default UserProfileService;
