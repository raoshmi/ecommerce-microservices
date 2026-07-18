import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartService from '../../../cart/CartService';
import CheckoutService from '../../CheckoutService';

export default function CheckoutPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        CartService.getCart()
            .then(data => {
                setCart(data);
                if (!data || !data.items || data.items.length === 0) {
                    navigate('/cart');
                }
            })
            .catch(err => console.error("Error loading cart for checkout", err))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleRazorpay = async () => {
        if (!fullName || !address || !city || !pincode || !phone) {
            setError('Please fill in all shipping details.');
            return;
        }

        try {
            setSubmitting(true);
            const orderRes = await CheckoutService.initiateRazorpayPayment();
            const { razorpayOrderId, amount, currency } = orderRes;

            const options = {
                key: "YOUR_RAZORPAY_KEY",
                amount: amount * 100,
                currency: currency,
                name: "E-Shop",
                description: "Purchase from E-Shop",
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await CheckoutService.verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        alert('Payment Successful! Order ID: ' + verifyRes.id);
                        navigate('/orders');
                    } catch (err) {
                        console.error(err);
                        alert('Payment verification failed.');
                    }
                },
                prefill: {
                    name: fullName,
                    contact: phone
                },
                theme: {
                    color: "#8b5cf6"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert('Failed to initiate payment.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDemoCheckout = async () => {
        if (!fullName || !address || !city || !pincode || !phone) {
            setError('Please fill in all shipping details.');
            return;
        }

        try {
            setSubmitting(true);
            await CheckoutService.placeDemoOrder();
            alert('Order placed successfully (Demo Checkout)!');
            navigate('/orders');
        } catch (err) {
            console.error(err);
            alert('Failed to place order.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading checkout...</div>;

    return (
        <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Checkout</h2>
            
            {error && <div style={{ color: '#EF4444', marginBottom: '1.5rem' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Shipping Details Form */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Shipping Address</h3>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                required 
                                value={fullName} 
                                onChange={e => setFullName(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                required 
                                value={address} 
                                onChange={e => setAddress(e.target.value)} 
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    required 
                                    value={city} 
                                    onChange={e => setCity(e.target.value)} 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pin Code</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    required 
                                    value={pincode} 
                                    onChange={e => setPincode(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input 
                                type="tel" 
                                className="form-input" 
                                required 
                                value={phone} 
                                onChange={e => setPhone(e.target.value)} 
                            />
                        </div>
                    </form>
                </div>

                {/* Order Summary Panel */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3>Order Summary</h3>
                    
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        {cart?.items?.map(item => (
                            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                                <span>{item.quantity}x {item.productName}</span>
                                <span style={{ fontWeight: '500' }}>₹{item.subtotal}</span>
                            </li>
                        ))}
                    </ul>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        <span>Total Amount:</span>
                        <span>₹{cart?.totalAmount}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <button 
                            className="btn" 
                            style={{ background: '#3498db', fontSize: '1rem', width: '100%' }}
                            onClick={handleRazorpay}
                            disabled={submitting}
                        >
                            {submitting ? 'Processing...' : 'Pay with Razorpay'}
                        </button>
                        <button 
                            className="btn" 
                            style={{ backgroundColor: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)', width: '100%' }}
                            onClick={handleDemoCheckout}
                            disabled={submitting}
                        >
                            {submitting ? 'Processing...' : 'Place Demo Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
