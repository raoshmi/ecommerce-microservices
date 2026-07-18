import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProductService from '../../ProductService';
import CategoryService from '../../../category/CategoryService';
import { AuthContext } from '../../../../context/AuthContext';

export default function ProductForm() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isEdit = !!id;

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        // Fetch categories for select dropdown
        CategoryService.getAllCategories()
            .then(data => setCategories(data))
            .catch(err => console.error("Failed to load categories", err));

        if (isEdit) {
            if (location.state?.product) {
                const prod = location.state.product;
                setName(prod.name);
                setDescription(prod.description || '');
                setPrice(prod.price);
                setStock(prod.stock || 0);
                setCategory(prod.category || '');
                setImageUrl(prod.imageUrl || '');
            } else {
                setLoading(true);
                ProductService.getProductById(id)
                    .then((prod) => {
                        setName(prod.name);
                        setDescription(prod.description || '');
                        setPrice(prod.price);
                        setStock(prod.stock || 0);
                        setCategory(prod.category || '');
                        setImageUrl(prod.imageUrl || '');
                    })
                    .catch((err) => {
                        console.error(err);
                        setError('Failed to fetch product details.');
                    })
                    .finally(() => setLoading(false));
            }
        }
    }, [id, isEdit, location.state, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !price || !category) {
            setError('Please fill in all required fields (Name, Price, Category).');
            return;
        }

        try {
            setLoading(true);
            const productData = {
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                stock: parseInt(stock) || 0,
                category: category,
                imageUrl: imageUrl.trim()
            };

            if (isEdit) {
                await ProductService.updateProduct(id, productData);
                alert('Product updated successfully.');
            } else {
                await ProductService.createProduct(productData);
                alert('Product created successfully.');
            }
            navigate('/products/manage');
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
            <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {isEdit ? 'Edit Product' : 'Add Product'}
                </h2>
                {error && <div style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Product Name *</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            required 
                            placeholder="e.g. Mechanical Keyboard"
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select 
                            className="form-input" 
                            required
                            value={category} 
                            onChange={e => setCategory(e.target.value)}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Price (₹) *</label>
                            <input 
                                type="number" 
                                step="0.01"
                                className="form-input" 
                                required 
                                placeholder="e.g. 79.99"
                                value={price} 
                                onChange={e => setPrice(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stock Quantity</label>
                            <input 
                                type="number" 
                                className="form-input" 
                                placeholder="e.g. 50"
                                value={stock} 
                                onChange={e => setStock(e.target.value)} 
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Image URL</label>
                        <input 
                            type="url" 
                            className="form-input" 
                            placeholder="https://images.unsplash.com/..."
                            value={imageUrl} 
                            onChange={e => setImageUrl(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea 
                            className="form-input" 
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            placeholder="Describe the product..."
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
                            onClick={() => navigate('/products/manage')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
