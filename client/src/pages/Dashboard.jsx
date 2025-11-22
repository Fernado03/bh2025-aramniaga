import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import technologyImage from '../assets/technology.jpg';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Calculate progress based on completed days
    const progress = user?.completedDays?.length || 0;
    const progressPercentage = Math.round((progress / 7) * 100);

    // Calculate streak
    const streak = progress > 0 ? progress : 0;

    // Get user initials
    const getUserInitial = () => {
        return user?.username ? user.username.charAt(0).toUpperCase() : 'U';
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        {
            icon: '👤',
            label: 'Profil Saya',
            desc: 'Lihat & edit profil anda',
            action: () => {
                setIsDrawerOpen(false);
                navigate('/profile');
            }
        },
        {
            icon: '✍️',
            label: 'Bio Generator',
            desc: 'Jana bio menarik',
            action: () => {
                setIsDrawerOpen(false);
                navigate('/day/2');
            }
        },
        {
            icon: '📊',
            label: 'Statistik',
            desc: 'Lihat prestasi anda',
            action: () => {
                setIsDrawerOpen(false);
                navigate('/statistics');
            }
        },
        {
            icon: '⚙️',
            label: 'Tetapan',
            desc: 'Konfigurasi akaun',
            action: () => {}
        },
        {
            icon: '❓',
            label: 'Bantuan',
            desc: 'Pusat bantuan & soalan',
            action: () => {}
        }
    ];

    const days = [
        { id: 1, title: 'Hari 1', emoji: '🎯', desc: 'Pendaftaran Akaun', status: progress >= 1 ? 'completed' : 'unlocked' },
        { id: 2, title: 'Hari 2', emoji: '📚', desc: 'Kenali Platform', status: progress >= 2 ? 'completed' : (progress >= 1 ? 'unlocked' : 'locked') },
        { id: 3, title: 'Hari 3', emoji: '✍️', desc: 'Cipta Post Pertama', status: progress >= 3 ? 'completed' : (progress >= 2 ? 'unlocked' : 'locked') },
        { id: 4, title: 'Hari 4', emoji: '🔒', desc: 'Balas Komen Pelanggan', status: progress >= 4 ? 'completed' : (progress >= 3 ? 'unlocked' : 'locked') },
        { id: 5, title: 'Hari 5', emoji: '🔒', desc: 'Tambah Gambar Produk', status: progress >= 5 ? 'completed' : (progress >= 4 ? 'unlocked' : 'locked') },
        { id: 6, title: 'Hari 6', emoji: '🔒', desc: 'Bina Story Menarik', status: progress >= 6 ? 'completed' : (progress >= 5 ? 'unlocked' : 'locked') },
        { id: 7, title: 'Hari 7', emoji: '🔒', desc: 'Analisis Prestasi', status: progress >= 7 ? 'completed' : (progress >= 6 ? 'unlocked' : 'locked') },
    ];

    const handleDayClick = (day) => {
        if (day.status !== 'locked') {
            navigate(`/day/${day.id}`);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'completed') return { text: '✓ SELESAI', class: 'badge-completed' };
        if (status === 'unlocked') return { text: '⚡ AKTIF', class: 'badge-active' };
        return { text: '🔒 TERKUNCI', class: 'badge-locked' };
    };

    const getButtonText = (status) => {
        if (status === 'completed') return '✓ Selesai';
        if (status === 'unlocked') return 'TEKAN UNTUK MULA ✨';
        return '🔒 Terkunci';
    };

    return (
        <div className="dashboard-container">
            {/* Top Header */}
            <div className="dashboard-top-header">
                <div className="header-logo-section">
                    <div className="header-logo">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 4L18 8L14 12L10 8L14 4Z" fill="white" opacity="0.9"/>
                            <path d="M8 10L12 14L8 18L4 14L8 10Z" fill="white" opacity="0.7"/>
                            <path d="M20 10L24 14L20 18L16 14L20 10Z" fill="white" opacity="0.7"/>
                            <path d="M14 16L18 20L14 24L10 20L14 16Z" fill="white"/>
                        </svg>
                    </div>
                    <div className="header-title-section">
                        <h1 className="header-title">PerniagaanDigital</h1>
                        <p className="header-subtitle">
                            AI Coach 🤖
                        </p>
                    </div>
                </div>
                <button 
                    className="header-profile-button"
                    onClick={() => setIsDrawerOpen(true)}
                >
                    {getUserInitial()}
                </button>
            </div>

            {/* Profile Drawer */}
            {isDrawerOpen && (
                <>
                    <div 
                        className="drawer-overlay" 
                        onClick={() => setIsDrawerOpen(false)}
                    />
                    <div className="profile-drawer">
                        <div className="drawer-header">
                            <button 
                                className="drawer-close-button"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                ×
                            </button>
                            <div className="drawer-profile-section">
                                <div className="drawer-avatar">
                                    {getUserInitial()}
                                </div>
                                <div className="drawer-profile-info">
                                    <h2>{user?.username || 'Usahawan'}</h2>
                                    <p>{user?.email || 'email@example.com'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="drawer-content">
                            <div className="drawer-menu-section">
                                <div className="drawer-menu-title">Menu Utama</div>
                                {menuItems.map((item, index) => (
                                    <div 
                                        key={index}
                                        className="drawer-menu-item"
                                        onClick={item.action}
                                    >
                                        <div className="drawer-menu-icon">
                                            {item.icon}
                                        </div>
                                        <div className="drawer-menu-text">
                                            <div className="drawer-menu-label">{item.label}</div>
                                            <div className="drawer-menu-desc">{item.desc}</div>
                                        </div>
                                        <div className="drawer-menu-arrow">›</div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                className="drawer-logout-button"
                                onClick={handleLogout}
                            >
                                <span>🚪</span>
                                <span>Log Keluar</span>
                            </button>
                        </div>

                        <div className="drawer-footer">
                            <p className="drawer-footer-text">© 2567 AramNiaga</p>
                        </div>
                    </div>
                </>
            )}

            {/* Dashboard Content */}
            <div className="dashboard-content">
            
            {/* Hero Image Section */}
            <div className="hero-image-section">
                <img 
                    src={technologyImage} 
                    alt="Teknologi Digital" 
                    className="hero-image"
                />
                <div className="hero-image-overlay">
                    <h2 className="hero-image-title">Transformasi Digital Bermula Di Sini</h2>
                </div>
            </div>

            {/* Welcome Hero */}
            <div className="welcome-hero">
                <h1 className="welcome-greeting">
                    Selamat Pagi, {user?.username || 'Kak Limah'}! 👋
                </h1>
                <p className="welcome-subtitle">
                    Mari teruskan perjalanan bisnes anda hari ini!
                </p>
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid">
                <div className="stat-card stat-card-followers">
                    <div className="stat-card-icon">👥</div>
                    <div className="stat-card-content">
                        <div className="stat-card-value">2,547</div>
                        <div className="stat-card-label">Pengikut</div>
                        <div className="stat-card-change positive">+12% ↑</div>
                    </div>
                </div>

                <div className="stat-card stat-card-likes">
                    <div className="stat-card-icon">❤️</div>
                    <div className="stat-card-content">
                        <div className="stat-card-value">8,432</div>
                        <div className="stat-card-label">Suka</div>
                        <div className="stat-card-change positive">+24% ↑</div>
                    </div>
                </div>

                <div className="stat-card stat-card-engagement">
                    <div className="stat-card-icon">💬</div>
                    <div className="stat-card-content">
                        <div className="stat-card-value">1,234</div>
                        <div className="stat-card-label">Komen</div>
                        <div className="stat-card-change positive">+8% ↑</div>
                    </div>
                </div>
            </div>

            {/* Progress Stats */}
            <div className="progress-stats">
                <div className="progress-stat-item">
                    <div className="progress-stat-number">{progress}</div>
                    <div className="progress-stat-label">Selesai</div>
                </div>
                <div className="progress-stat-divider"></div>
                <div className="progress-stat-item">
                    <div className="progress-stat-number">{7 - progress}</div>
                    <div className="progress-stat-label">Baki</div>
                </div>
                <div className="progress-stat-divider"></div>
                <div className="progress-stat-item">
                    <div className="progress-stat-number">{streak}</div>
                    <div className="progress-stat-label">Streak 🔥</div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="progress-section">
                <div className="progress-header">
                    <span className="progress-title">Kemajuan Keseluruhan</span>
                    <span className="progress-percentage">{progressPercentage}%</span>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="progress-label">
                    {progress} daripada 5 tugas selesai
                </div>
            </div>

            {/* Timeline */}
            <div className="timeline-section">
                <div className="timeline-header">
                    <h2 className="timeline-title">TUGAS HARI INI</h2>
                    <span className="timeline-badge">⚡ {progress}/7</span>
                </div>

                <div className="timeline-container">
                    <div className="timeline-line"></div>
                    {days.map((day) => {
                        const badge = getStatusBadge(day.status);
                        const isActive = day.status === 'unlocked';
                        const isCompleted = day.status === 'completed';
                        const isLocked = day.status === 'locked';

                        return (
                            <div
                                key={day.id}
                                className={`timeline-item ${
                                    isCompleted ? 'timeline-item-completed' : 
                                    isActive ? 'timeline-item-active' : 
                                    'timeline-item-locked'
                                }`}
                            >
                                <div className={`timeline-icon ${
                                    isCompleted ? 'timeline-icon-completed' : 
                                    isActive ? 'timeline-icon-active' : 
                                    'timeline-icon-locked'
                                }`}>
                                    {isCompleted ? '✓' : isActive ? day.emoji : '🔒'}
                                </div>
                                
                                <div className="timeline-item-header">
                                    <div>
                                        <div className="timeline-item-title">
                                            {day.title} {day.emoji}
                                        </div>
                                        <div className="timeline-item-desc">{day.desc}</div>
                                    </div>
                                    <span className={`timeline-item-badge ${badge.class}`}>
                                        {badge.text}
                                    </span>
                                </div>

                                <button
                                    className={`timeline-item-button ${
                                        isCompleted ? 'button-completed' : 
                                        isActive ? 'button-active' : 
                                        'button-locked'
                                    }`}
                                    onClick={() => handleDayClick(day)}
                                    disabled={isLocked || isCompleted}
                                >
                                    {getButtonText(day.status)}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Motivational Quote */}
            <div className="quote-section">
                <div className="quote-icon">💪</div>
                <div className="quote-text">
                    "Setiap langkah kecil membawa kejayaan!"
                </div>
            </div>
            </div>
        </div>
    );
};

export default Dashboard;
