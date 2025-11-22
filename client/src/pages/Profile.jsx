import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <div className="header-top">
                    <button className="back-button" onClick={() => navigate('/dashboard')}>
                        ←
                    </button>
                    <div className="header-title-section">
                        <h1 className="page-title">Profil Saya</h1>
                        <p className="page-subtitle">Maklumat akaun anda</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="profile-content">
                {/* Avatar Section */}
                <div className="avatar-section">
                    <div className="avatar-circle">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <h2 className="username">{user?.username}</h2>
                    <p className="member-since">Ahli sejak 2025</p>
                </div>

                {/* Info Card */}
                <div className="info-card">
                    <h3 className="card-title">Maklumat Peribadi</h3>
                    
                    <div className="info-item">
                        <div className="info-icon">👤</div>
                        <div className="info-details">
                            <p className="info-label">Nama Pengguna</p>
                            <p className="info-value">{user?.username}</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">📧</div>
                        <div className="info-details">
                            <p className="info-label">Emel</p>
                            <p className="info-value">{user?.email}</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">💼</div>
                        <div className="info-details">
                            <p className="info-label">Nama Bisnes</p>
                            <p className="info-value">{user?.businessName || 'Belum ditetapkan'}</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">🏷️</div>
                        <div className="info-details">
                            <p className="info-label">Kategori</p>
                            <p className="info-value">{user?.niche || 'Belum ditetapkan'}</p>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button className="logout-button" onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    <span>Log Keluar</span>
                </button>
            </div>
        </div>
    );
};

export default Profile;
