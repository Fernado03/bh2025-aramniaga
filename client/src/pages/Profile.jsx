import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import PageHeader from '../components/PageHeader';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="profile-container">
            <PageHeader
                title="Profil Saya"
                subtitle="Tetapan & Maklumat"
                backPath="/dashboard"
            />

            <div className="profile-content">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                    <div className="profile-avatar">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="profile-identity">
                        <h2 className="profile-name">{user?.username || 'Pengguna'}</h2>
                        <p className="profile-email">{user?.email}</p>
                        <div className="profile-badges">
                            <span className="badge-pro">PRO MEMBER</span>
                        </div>
                    </div>
                </div>

                {/* Stats Summary (Optional, adds visual interest) */}
                <div className="profile-stats-row">
                    <div className="stat-box">
                        <span className="stat-value">{user?.completedDays?.length || 0}</span>
                        <span className="stat-label">Hari Selesai</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-value">6</span>
                        <span className="stat-label">Jumlah Misi</span>
                    </div>
                </div>

                {/* Details List */}
                <div className="section-label">MAKLUMAT BISNES</div>
                <div className="profile-menu-card">
                    <div className="menu-item">
                        <div className="menu-icon">💼</div>
                        <div className="menu-content">
                            <span className="menu-label">Nama Bisnes</span>
                            <span className="menu-value">{user?.businessName || '-'}</span>
                        </div>
                    </div>
                    <div className="menu-divider"></div>
                    <div className="menu-item">
                        <div className="menu-icon">🏷️</div>
                        <div className="menu-content">
                            <span className="menu-label">Kategori / Niche</span>
                            <span className="menu-value">{user?.niche || 'General'}</span>
                        </div>
                    </div>
                </div>

                <div className="section-label">AKSES</div>
                <div className="profile-menu-card">
                    <div className="menu-item">
                        <div className="menu-icon">🔐</div>
                        <div className="menu-content">
                            <span className="menu-label">Tukar Kata Laluan</span>
                            <span className="menu-arrow">›</span>
                        </div>
                    </div>
                </div>

                <button className="action-logout-btn" onClick={handleLogout}>
                    Log Keluar
                </button>

                <p className="version-text">Versi 1.0.0 • AramNiaga</p>
            </div>
        </div>
    );
};

export default Profile;
