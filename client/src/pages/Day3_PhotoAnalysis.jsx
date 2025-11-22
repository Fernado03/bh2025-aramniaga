import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiAPI, userAPI } from '../utils/api';
import { fileToBase64 } from '../utils/helpers';
import LoadingOverlay from '../components/LoadingOverlay';
import './Day3_PhotoAnalysis.css';

const Day3_PhotoAnalysis = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const base64 = await fileToBase64(file);
            setPreview(base64);
            setAnalysis(null);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', image);

            const response = await aiAPI.analyzeImage(formData);
            setAnalysis(response.data);

            await userAPI.updateProgress(3);
            updateUser({ progress: Math.max(user.progress, 4) });
        } catch (error) {
            console.error('Error analyzing image:', error);
            alert('Maaf, ada masalah. Sila cuba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyCaption = () => {
        if (analysis?.caption) {
            navigator.clipboard.writeText(analysis.caption);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="photo-analysis-container">
            {loading && <LoadingOverlay message="AI sedang menganalisis foto anda..." />}
            
            {/* Header */}
            <div className="photo-header">
                <div className="header-top">
                    <button className="back-button" onClick={() => navigate('/dashboard')}>
                        ←
                    </button>
                    <div className="header-title-section">
                        <h1 className="page-title">Analisis Post</h1>
                        <p className="page-subtitle">Upload foto untuk analisis AI</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="photo-content">
                {/* Info Card */}
                <div className="info-card">
                    <div className="info-icon">📸</div>
                    <div className="info-text">
                        <h2 className="info-title">Foto Yang Menjual</h2>
                        <p className="info-desc">Upload gambar produk anda. AI akan beri komen dan cadangan caption!</p>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="upload-section">
                    <div className="upload-area">
                        <input
                            type="file"
                            id="photo-input"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="photo-input"
                        />
                        <label htmlFor="photo-input" className="upload-label">
                            {preview ? (
                                <div className="preview-container">
                                    <img src={preview} alt="Preview" className="preview-image" />
                                    <div className="change-overlay">
                                        <span className="change-text">📷 Tukar Foto</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="upload-placeholder">
                                    <div className="upload-icon">📤</div>
                                    <p className="upload-text">Tekan untuk pilih foto</p>
                                    <p className="upload-hint">Gambar produk atau posting anda</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <button 
                        className="analyze-button"
                        onClick={handleAnalyze}
                        disabled={!image || loading}
                    >
                        <span className="button-icon">🔍</span>
                        <span className="button-text">Analisis Foto</span>
                    </button>
                </div>

                {/* Results */}
                {analysis && (
                    <div className="results-section">
                        {/* AI Feedback */}
                        <div className="feedback-card">
                            <h3 className="feedback-title">💡 Komen AI:</h3>
                            <p className="feedback-text">{analysis.feedback}</p>
                        </div>

                        {/* Caption Card */}
                        <div className="caption-card">
                            <div className="caption-header">
                                <h3 className="caption-title">✍️ Cadangan Caption</h3>
                                <button 
                                    className={`copy-button ${copied ? 'copied' : ''}`}
                                    onClick={handleCopyCaption}
                                >
                                    {copied ? '✓ Disalin!' : '📋 Salin'}
                                </button>
                            </div>
                            <div className="caption-content">
                                <p className="caption-text">{analysis.caption}</p>
                            </div>
                        </div>

                        <div className="success-message">
                            <div className="success-icon">✅</div>
                            <div className="success-text">
                                <p className="success-title">Analisis Selesai!</p>
                                <p className="success-desc">Gunakan caption ini untuk posting anda di media sosial.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!analysis && !loading && (
                    <div className="empty-state">
                        <div className="empty-icon">🖼️</div>
                        <p className="empty-text">Upload foto untuk mendapat analisis dan caption dari AI</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Day3_PhotoAnalysis;
