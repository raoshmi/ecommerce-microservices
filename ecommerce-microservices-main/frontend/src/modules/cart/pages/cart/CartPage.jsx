import { useState, useEffect } from 'react';
import CartService from '../../CartService';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const data = await CartService.getCart();
            setCart(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            removeItem(itemId);
            return;
        }
        try {
            await CartService.updateQuantity(itemId, quantity);
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await CartService.removeItem(itemId);
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading cart...</div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return <div className="container" style={{ marginTop: '2rem' }}><h2>Your cart is empty</h2></div>;
    }

    return (
        <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Shopping Cart</h2>
            <div className="card" style={{ padding: '0' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {cart.items.map(item => (
                        <li key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ flex: 1 }}>
                                <h3>{item.productName}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>₹{item.price} each</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button className="btn" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button className="btn" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)' }} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                </div>
                                <div style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                                    ₹{item.subtotal}
                                </div>
                                <button className="btn" style={{ backgroundColor: '#EF4444', padding: '0.25rem 0.5rem' }} onClick={() => removeItem(item.id)}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: '1rem', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total: ₹{cart.totalAmount}</span>
                        <button className="btn" style={{ fontSize: '1.125rem' }} onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
