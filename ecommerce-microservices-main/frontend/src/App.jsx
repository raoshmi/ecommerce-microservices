import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Import Modular routes
import AuthRoutes from './routes/AuthRoutes';
import ProductRoutes from './routes/ProductRoutes';
import CategoryRoutes from './routes/CategoryRoutes';
import CartRoutes from './routes/CartRoutes';
import OrderRoutes from './routes/OrderRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProfileRoutes from './routes/ProfileRoutes';
import CheckoutRoutes from './routes/CheckoutRoutes';

function Home() {
  return (
    <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Welcome to E-Shop</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        The best microservices-powered e-commerce platform.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Browse Products</h3>
          <p style={{ color: 'var(--text-muted)' }}>Explore our catalog of high-quality items.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Secure Checkout</h3>
          <p style={{ color: 'var(--text-muted)' }}>Fast and safe checkout via our API Gateway.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Order Tracking</h3>
          <p style={{ color: 'var(--text-muted)' }}>Keep an eye on all your past purchases.</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/products/*" element={<ProductRoutes />} />
          <Route path="/category/*" element={<CategoryRoutes />} />
          <Route path="/cart/*" element={<CartRoutes />} />
          <Route path="/orders/*" element={<OrderRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/profile/*" element={<ProfileRoutes />} />
          <Route path="/checkout/*" element={<CheckoutRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
