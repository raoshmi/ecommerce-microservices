import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CategoryService from '../../CategoryService';
import { AuthContext } from '../../../../context/AuthContext';

export default function CategoryForm() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isEdit = !!id;

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        if (isEdit) {
            if (location.state?.category) {
                setName(location.state.category.name);
                setDescription(location.state.category.description || '');
            } else {
                setLoading(true);
                CategoryService.getCategoryById(id)
                    .then((data) => {
                        setName(data.name);
                        setDescription(data.description || '');
                    })
                    .catch((err) => {
                        console.error(err);
                        setError('Failed to fetch category details.');
                    })
                    .finally(() => setLoading(false));
            }
        }
    }, [id, isEdit, location.state, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!name.trim()) {
            setError('Category name is required.');
            return;
        }

        try {
            setLoading(true);
            const categoryData = { name: name.trim(), description: description.trim() };

            if (isEdit) {
                await CategoryService.updateCategory(id, categoryData);
                alert('Category updated successfully.');
            } else {
                await CategoryService.createCategory(categoryData);
                alert('Category created successfully.');
            }
            navigate('/category/list');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !name) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', paddingBottom: '4rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {isEdit ? 'Edit Category' : 'Add Category'}
                </h2>
                {error && <div style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Category Name</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            required 
                            placeholder="e.g. Electronics"
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea 
                            className="form-input" 
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            placeholder="Brief description of the category..."
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                            type="button" 
                            className="btn" 
                            style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                            onClick={() => navigate('/category/list')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
