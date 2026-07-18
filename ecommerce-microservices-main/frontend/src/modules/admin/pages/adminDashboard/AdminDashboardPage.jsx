import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboardService from '../../AdminDashboardService';

const AdminDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
    } else {
      AdminDashboardService.getStats()
        .then(data => setStats(data))
        .catch(err => console.error("Failed to fetch admin stats", err))
        .finally(() => setLoading(false));
    }
  }, [user, navigate]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading dashboard...</div>;

  return (
    <div className="container" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
        Admin Dashboard
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ textAlign: 'center', borderTop: '4px solid #10B981' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Total Revenue</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0', color: '#10B981' }}>₹{stats.revenue.toFixed(2)}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Total Orders</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>{stats.orders}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Active Products</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>{stats.products}</p>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => navigate('/products/add')}>Add Product</button>
          <button className="btn" onClick={() => navigate('/category/add')}>Add Category</button>
          <button className="btn btn-primary" onClick={() => navigate('/products/manage')} style={{ background: 'var(--surface)', color: 'var(--text)' }}>Manage Products</button>
          <button className="btn btn-primary" onClick={() => navigate('/category/list')} style={{ background: 'var(--surface)', color: 'var(--text)' }}>Manage Categories</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
