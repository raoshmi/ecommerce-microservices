import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../CategoryService';
import { AuthContext } from '../../../../context/AuthContext';

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const data = await CategoryService.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await CategoryService.deleteCategory(id);
                alert('Category deleted successfully.');
                fetchCategories();
            } catch (err) {
                console.error(err);
                alert('Failed to delete category.');
            }
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading categories...</div>;

    const isAdmin = user && user.role === 'ADMIN';

    return (
        <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Category List</h2>
                {isAdmin && (
                    <button className="btn" onClick={() => navigate('/category/add')}>
                        Add Category
                    </button>
                )}
            </div>

            {error && <div style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</div>}

            <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.05)' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Description</th>
                            {isAdmin && <th style={{ padding: '1rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.3s' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>{cat.id}</td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{cat.name}</td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{cat.description || 'No description'}</td>
                                {isAdmin && (
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <button 
                                            className="btn" 
                                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: 'var(--primary)', marginRight: '0.5rem' }}
                                            onClick={() => navigate(`/category/edit/${cat.id}`, { state: { category: cat } })}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn" 
                                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: '#EF4444' }}
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={isAdmin ? 4 : 3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No categories available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
