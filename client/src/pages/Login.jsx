import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        🚀
                    </div>
                    <h1 className="login-title">Selamat Kembali! 👋</h1>
                    <p className="login-subtitle">Log masuk untuk teruskan perjalanan bisnes anda.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">
                            Emel <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <input
                            className="form-input"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="nama@contoh.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Kata Laluan <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <input
                            className="form-input"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="forgot-password">
                        <a href="#" className="forgot-password-link">Lupa kata laluan?</a>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading && <span className="loading-spinner"></span>}
                        {loading ? 'Memuatkan...' : 'Log Masuk'}
                    </button>
                </form>

                <div className="divider">atau</div>

                <p className="register-link">
                    Belum ada akaun? <Link to="/register">Daftar Sekarang</Link>
                </p>
            </div>

            <p className="login-footer">
                © 2567 AramNiaga. Semua hak terpelihara.
            </p>
        </div>
    );
};

export default Login;
