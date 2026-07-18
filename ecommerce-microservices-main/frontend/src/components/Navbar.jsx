import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <nav style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '800' }}>E-Shop</Link>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/products">Products</Link>
                    <Link to="/category/list">Categories</Link>
                    {user ? (
                        <>
                            <Link to="/cart">Cart</Link>
                            <Link to="/orders">Orders</Link>
                            <Link to="/profile">Profile</Link>
                            {user.role === 'ADMIN' && <Link to="/admin" style={{ color: 'var(--primary)' }}>Admin</Link>}
                            <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Hi, {user.name}</span>
                            <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#EF4444' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login" className="btn" style={{ padding: '0.25rem 0.75rem', backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }}>Login</Link>
                            <Link to="/auth/register" className="btn" style={{ padding: '0.25rem 0.75rem' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
