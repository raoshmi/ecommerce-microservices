import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import UserProfileService from '../../UserProfileService';

export default function UserProfilePage() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            UserProfileService.getProfile()
                .then(data => setProfile(data))
                .catch(err => console.error("Error fetching user profile", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading profile...</div>;

    if (!user) return <div className="container" style={{ marginTop: '2rem' }}><h2>Please log in to view your profile</h2></div>;

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', paddingBottom: '4rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>User Profile</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Full Name</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>{profile?.name || user.name}</span>
                    </div>

                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email Address</span>
                        <span style={{ fontSize: '1.125rem' }}>{profile?.email || user.email}</span>
                    </div>

                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Role</span>
                        <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {profile?.role || user.role}
                        </span>
                    </div>

                    {profile?.createdAt && (
                        <div>
                            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Member Since</span>
                            <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
