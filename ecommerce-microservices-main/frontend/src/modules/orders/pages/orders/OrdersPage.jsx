import { useState, useEffect } from 'react';
import OrderService from '../../OrderService';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        OrderService.getOrders()
            .then(data => setOrders(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading orders...</div>;

    if (orders.length === 0) return <div className="container" style={{ marginTop: '2rem' }}><h2>You have no orders</h2></div>;

    return (
        <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Your Orders</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map(order => (
                    <div key={order.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <span style={{ fontWeight: 'bold' }}>Order #{order.id}</span>
                                <span style={{ toggleMargin: 'left', marginLeft: '1rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <span>Status: <span style={{ fontWeight: '500', color: 'var(--primary)' }}>{order.status}</span></span>
                                <span>Total: <span style={{ fontWeight: 'bold' }}>₹{order.totalAmount}</span></span>
                            </div>
                        </div>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            {order.items.map(item => (
                                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>{item.quantity}x {item.productName}</span>
                                    <span>₹{item.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
