import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(formData);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <div className="register-logo">
                        🚀
                    </div>
                    <h1 className="register-title">Mula Sekarang 🚀</h1>
                    <p className="register-subtitle">Bina empayar bisnes anda dalam 7 hari.</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="register-form-group">
                        <label className="register-form-label">
                            Nama Pengguna <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <input
                            className="register-form-input"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Cth: AliMaju"
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-form-label">
                            Emel <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <input
                            className="register-form-input"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="nama@contoh.com"
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-form-label">
                            Kata Laluan <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <input
                            className="register-form-input"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <p className="register-terms">
                        Dengan mendaftar, anda bersetuju dengan <a href="#">Terma & Syarat</a> kami.
                    </p>

                    {error && (
                        <div className="register-error-message">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" className="register-button" disabled={loading}>
                        {loading && <span className="register-loading-spinner"></span>}
                        {loading ? 'Memuatkan...' : 'Daftar Akaun'}
                    </button>
                </form>

                <div className="register-divider">atau</div>

                <p className="register-login-link">
                    Sudah ada akaun? <Link to="/login">Log Masuk</Link>
                </p>
            </div>

            <p className="register-footer">
                © 2567 AramNiaga. Semua hak terpelihara.
            </p>
        </div>
    );
};

export default Register;
