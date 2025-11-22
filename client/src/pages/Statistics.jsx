import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Statistics.css';

const Statistics = () => {
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState('Nov 2025');

    // Mock data for statistics
    const monthlyData = {
        'Okt 2025': { 
            followers: 2341, 
            likes: 7823, 
            comments: 1089, 
            growth: [20, 35, 40, 55, 60, 70, 75] 
        },
        'Nov 2025': { 
            followers: 2547, 
            likes: 8432, 
            comments: 1234, 
            growth: [75, 80, 85, 92, 95, 98, 100] 
        },
        'Dis 2025': { 
            followers: 2789, 
            likes: 9156, 
            comments: 1456, 
            growth: [100, 110, 115, 120, 125, 130, 135] 
        }
    };

    const currentStats = monthlyData[selectedMonth];

    return (
        <div className="statistics-container">
            {/* Header */}
            <div className="statistics-header">
                <div className="header-top">
                    <button className="back-button" onClick={() => navigate('/dashboard')}>
                        ←
                    </button>
                    <div className="header-title-section">
                        <h1 className="page-title">Statistik</h1>
                        <p className="page-subtitle">Prestasi Media Sosial Anda</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="statistics-content">
                {/* Info Card */}
                <div className="info-card">
                    <div className="info-icon">📊</div>
                    <div className="info-text">
                        <h2 className="info-title">Pantau Prestasi Anda</h2>
                        <p className="info-desc">Lihat statistik dan pertumbuhan akaun media sosial anda di sini!</p>
                    </div>
                </div>

                {/* Detailed Stats Cards - Single Row */}
                <div className="detailed-stats-grid">
                    <div className="detailed-stat-card card-followers">
                        <div className="detailed-stat-icon">👥</div>
                        <div className="detailed-stat-value">{currentStats.followers.toLocaleString()}</div>
                        <div className="detailed-stat-label">Pengikut</div>
                        <div className="detailed-stat-change positive">+12% ↑</div>
                    </div>

                    <div className="detailed-stat-card card-likes">
                        <div className="detailed-stat-icon">❤️</div>
                        <div className="detailed-stat-value">{currentStats.likes.toLocaleString()}</div>
                        <div className="detailed-stat-label">Suka</div>
                        <div className="detailed-stat-change positive">+24% ↑</div>
                    </div>

                    <div className="detailed-stat-card card-comments">
                        <div className="detailed-stat-icon">💬</div>
                        <div className="detailed-stat-value">{currentStats.comments.toLocaleString()}</div>
                        <div className="detailed-stat-label">Komen</div>
                        <div className="detailed-stat-change positive">+8% ↑</div>
                    </div>
                </div>

                {/* Month Filter */}
                <div className="month-filter-section">
                    <label className="month-filter-label">📅 Pilih Bulan:</label>
                    <select 
                        className="month-filter-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        <option value="Okt 2025">Oktober 2025</option>
                        <option value="Nov 2025">November 2025</option>
                        <option value="Dis 2025">Disember 2025</option>
                    </select>
                </div>

                {/* Growth Chart */}
                <div className="growth-chart-section">
                    <h3 className="growth-chart-title">📈 Graf Pertumbuhan - {selectedMonth}</h3>
                    <p className="growth-chart-desc">Pertumbuhan pengikut sepanjang bulan</p>
                    
                    <div className="growth-chart">
                        {currentStats.growth.map((value, index) => (
                            <div key={index} className="chart-bar-container">
                                <div 
                                    className="chart-bar"
                                    style={{ height: `${(value / Math.max(...currentStats.growth)) * 100}%` }}
                                >
                                    <div className="chart-bar-value">{value}</div>
                                </div>
                                <div className="chart-bar-label">Mg {index + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="stats-summary">
                    <div className="summary-icon">🎯</div>
                    <div className="summary-text">
                        <p className="summary-title">Prestasi Cemerlang!</p>
                        <p className="summary-desc">Akaun anda menunjukkan pertumbuhan yang sihat untuk bulan {selectedMonth}. Teruskan usaha!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
