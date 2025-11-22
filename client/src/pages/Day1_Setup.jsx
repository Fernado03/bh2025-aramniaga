import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import './Day1_Setup.css';

const Day1_Setup = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: user?.businessName || '',
        niche: user?.niche || '',
        description: user?.description || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userAPI.updateProfile(formData);
            await userAPI.updateProgress(1);
            updateUser({ ...formData, progress: Math.max(user.progress, 2) });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Maaf, ada masalah. Sila cuba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="day1-setup-container">
            {/* Header */}
            <div className="day1-header">
                <div className="header-top">
                    <button className="back-button" onClick={() => navigate('/dashboard')}>
                        ←
                    </button>
                    <div className="header-title-section">
                        <h1 className="page-title">Setup Bisnes</h1>
                        <p className="page-subtitle">Langkah pertama memulakan perjalanan</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="day1-content">
                {/* Info Card */}
                <div className="info-card">
                    <div className="info-icon">🚀</div>
                    <div className="info-text">
                        <h2 className="info-title">Jom Mula!</h2>
                        <p className="info-desc">Beritahu kami tentang bisnes anda supaya AI boleh bantu dengan lebih tepat.</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="setup-form">
                    <div className="form-group">
                        <label className="form-label">Nama Bisnes</label>
                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder="Contoh: Kek Sedap Melaka"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Niche / Kategori</label>
                        <input
                            type="text"
                            name="niche"
                            value={formData.niche}
                            onChange={handleChange}
                            placeholder="Contoh: Makanan & Minuman"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Penerangan Ringkas</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Contoh: Kami menjual kek lapis Sarawak asli yang sedap..."
                            className="form-textarea"
                            rows="5"
                            required
                        />
                        <p className="form-hint">💡 Tip: Terangkan apa yang bisnes anda jual</p>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? '⏳ Menyimpan...' : '✓ Simpan & Selesai'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Day1_Setup;
