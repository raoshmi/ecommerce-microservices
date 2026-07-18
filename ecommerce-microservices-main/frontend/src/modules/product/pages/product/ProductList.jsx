import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../ProductService';
import { AuthContext } from '../../../../context/AuthContext';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const data = await ProductService.getProducts('', '', '', '', 0, 100);
            setProducts(data.content || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await ProductService.deleteProduct(id);
                alert('Product deleted successfully.');
                fetchProducts();
            } catch (err) {
                console.error(err);
                alert('Failed to delete product.');
            }
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading products...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Product Management</h2>
                <button className="btn" onClick={() => navigate('/products/add')}>
                    Add Product
                </button>
            </div>

            {error && <div style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</div>}

            <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.05)' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>ID</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Category</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Price</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Stock</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((prod) => (
                            <tr key={prod.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.3s' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>{prod.id}</td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{prod.name}</td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--primary)' }}>{prod.category}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>₹{prod.price}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>{prod.stock}</td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <button 
                                        className="btn" 
                                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: 'var(--primary)', marginRight: '0.5rem' }}
                                        onClick={() => navigate(`/products/edit/${prod.id}`, { state: { product: prod } })}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn" 
                                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', background: '#EF4444' }}
                                        onClick={() => handleDelete(prod.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No products available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
