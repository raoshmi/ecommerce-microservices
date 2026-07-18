import { createContext, useState, useEffect } from 'react';
import AuthService from '../modules/auth/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            AuthService.getCurrentUser()
                .then(data => setUser(data))
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const data = await AuthService.login(email, password);
        localStorage.setItem('token', data.token);
        setUser({ id: data.userId, name: data.name, email: data.email, role: data.role });
    };

    const register = async (name, email, password) => {
        const data = await AuthService.register(name, email, password);
        localStorage.setItem('token', data.token);
        setUser({ id: data.userId, name: data.name, email: data.email, role: data.role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
