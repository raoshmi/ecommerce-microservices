import { useState, useEffect, useContext } from 'react';
import ProductService from '../../ProductService';
import CategoryService from '../../../category/CategoryService';
import CartService from '../../../cart/CartService';
import { AuthContext } from '../../../../context/AuthContext';

export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    // Filter states
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    // Load categories
    useEffect(() => {
        CategoryService.getAllCategories()
            .then(data => setCategories(data))
            .catch(err => console.error("Error loading categories", err));
    }, []);

    // Load products when filter or page changes
    const fetchProducts = () => {
        setLoading(true);
        ProductService.getProducts(search, selectedCategory, minPrice, maxPrice, currentPage - 1, itemsPerPage)
            .then(res => {
                setProducts(res.content || []);
                setTotalPages(res.totalPages || 1);
                
                // Fetch recommendations based on the first product for demo
                if (res.content && res.content.length > 0) {
                    ProductService.getRecommendationsByProductId(res.content[0].id)
                        .then(recRes => setRecommendations(recRes))
                        .catch(err => console.error("Error fetching recommendations", err));
                }
            })
            .catch(err => console.error("Error fetching products", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, currentPage]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const handleResetFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setCurrentPage(1);
        // We need to fetch directly as state update is async
        ProductService.getProducts('', '', '', '', 0, itemsPerPage)
            .then(res => {
                setProducts(res.content || []);
                setTotalPages(res.totalPages || 1);
            });
    };

    const addToCart = async (productId) => {
        if (!user) {
            alert('Please login to add to cart');
            return;
        }
        try {
            await CartService.addItem(productId, 1);
            alert('Added to cart!');
        } catch (err) {
            console.error(err);
            alert('Failed to add to cart');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <h2>Explore Catalog</h2>
                
                {/* Search & Filter Panel */}
                <form onSubmit={handleSearchSubmit} className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Search Products</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Search by name..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Category</label>
                        <select 
                            className="form-input" 
                            value={selectedCategory} 
                            onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Min Price (₹)</label>
                        <input 
                            type="number" 
                            className="form-input" 
                            placeholder="Min" 
                            value={minPrice} 
                            onChange={e => setMinPrice(e.target.value)} 
                        />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Max Price (₹)</label>
                        <input 
                            type="number" 
                            className="form-input" 
                            placeholder="Max" 
                            value={maxPrice} 
                            onChange={e => setMaxPrice(e.target.value)} 
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" className="btn" style={{ flex: 1 }}>Filter</button>
                        <button type="button" className="btn" onClick={handleResetFilters} style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }}>Reset</button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>Loading products...</div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {products.map(p => (
                            <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                {p.imageUrl ? (
                                    <img 
                                        src={p.imageUrl} 
                                        alt={p.name} 
                                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.25rem', marginBottom: '1rem' }} 
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800';
                                        }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--bg)', borderRadius: '0.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Image</div>
                                )}
                                <h3 style={{ fontSize: '1.125rem' }}>{p.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>{p.description}</p>
                                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: '500' }}>{p.category}</span>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>₹{p.price}</span>
                                    <button className="btn" onClick={() => addToCart(p.id)}>Add to Cart</button>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && <p>No products match your filters.</p>}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                            <button 
                                className="btn" 
                                style={{ backgroundColor: currentPage === 1 ? 'var(--border)' : 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i + 1} 
                                    className="btn" 
                                    style={{ 
                                        padding: '0.5rem 1rem',
                                        backgroundColor: currentPage === i + 1 ? 'var(--primary)' : 'var(--bg)', 
                                        color: currentPage === i + 1 ? 'white' : 'var(--text-main)',
                                        border: currentPage === i + 1 ? 'none' : '1px solid var(--border)'
                                    }}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                className="btn" 
                                style={{ backgroundColor: currentPage === totalPages ? 'var(--border)' : 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* AI Recommendations Section */}
            {recommendations.length > 0 && (
                <div style={{ marginTop: '5rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>AI Recommended for You <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--primary)' }}>(Smart Suggest)</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {recommendations.map(p => (
                            <div key={`rec-${p.id}`} className="card" style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--primary-light)', backgroundColor: 'rgba(52, 152, 219, 0.05)' }}>
                                {p.imageUrl && (
                                    <img 
                                        src={p.imageUrl} 
                                        alt={p.name} 
                                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.25rem', marginBottom: '0.5rem' }} 
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800';
                                        }}
                                    />
                                )}
                                <h4 style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{p.name}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontWeight: 'bold' }}>₹{p.price}</span>
                                    <button className="btn btn-sm" onClick={() => addToCart(p.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Add</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
