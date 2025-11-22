import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiAPI, userAPI } from '../utils/api';
import { fileToBase64 } from '../utils/helpers';
import './Day3_PhotoAnalysis.css';

import PageHeader from '../components/PageHeader';

const Day3_PhotoAnalysis = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [captions, setCaptions] = useState([]);
    const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            try {
                const base64 = await fileToBase64(file);
                setPreview(base64);
                setAnalysis(null);
                setCaptions([]);
                setCurrentCaptionIndex(0);
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }
    };

    const handleAnalyze = async () => {
        if (!preview) return;
        setLoading(true);
        try {
            const response = await aiAPI.analyzeImage(preview);
            setAnalysis(response.data);
            setCaptions(response.data.captions || []);
            setCurrentCaptionIndex(0);

            // Don't complete yet, let user choose/copy a caption first
        } catch (error) {
            console.error('Error analyzing image:', error);
            alert('Maaf, ada masalah. Sila cuba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleNextCaption = () => {
        if (captions.length === 0) return;
        setCurrentCaptionIndex((prev) => (prev + 1) % captions.length);
    };

    const handlePrevCaption = () => {
        if (captions.length === 0) return;
        setCurrentCaptionIndex((prev) => (prev - 1 + captions.length) % captions.length);
    };

    const copyToClipboard = async (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);

        try {
            // Mark Day 3 as complete and get updated data
            const progressResponse = await userAPI.updateProgress(3);

            // Update local user context with ALL new data from backend
            updateUser({
                completedDays: progressResponse.data.completedDays,
                currentDay: progressResponse.data.currentDay,
                stats: progressResponse.data.stats,
                badges: progressResponse.data.badges
            });

            // Show success message
            setTimeout(() => setCopied(false), 2000);

            // Redirect to dashboard
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    return (
        <div className="photo-analysis-container">
            <PageHeader
                title="Analisis Post"
                subtitle="Upload foto untuk analisis AI"
                onBack={() => navigate('/dashboard')}
            />

            <div className="photo-content">
                <div className="info-card">
                    <div className="info-icon">📸</div>
                    <div className="info-text">
                        <h3 className="info-title">Analisis Gambar</h3>
                        <p className="info-desc">AI akan cadangkan caption yang sesuai untuk gambar anda.</p>
                    </div>
                </div>

                <div className="upload-section">
                    <div className="upload-area">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            id="photo-input"
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

                            {loading && (
                                <div className="image-loading-overlay">
                                    <div className="loading-spinner"></div>
                                    <p>AI sedang menganalisis foto anda...</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <button
                        className="analyze-button"
                        onClick={handleAnalyze}
                        disabled={!image || loading}
                    >
                        {loading ? (
                            <span className="button-text">Sedang Menganalisis...</span>
                        ) : (
                            <>
                                <span className="button-icon">✨</span>
                                <span className="button-text">Analisis Foto</span>
                            </>
                        )}
                    </button>
                </div>

                {analysis && (
                    <div className="results-section">
                        <div className="feedback-card">
                            <div className="feedback-header">
                                <div className="grade-circle">{analysis.grade || 'B'}</div>
                                <h3 className="feedback-title">Analisis AI</h3>
                            </div>
                            <p className="feedback-text">{analysis.feedback}</p>
                        </div>

                        {captions.length > 0 && (
                            <div className="caption-card">
                                <div className="caption-header">
                                    <h3 className="caption-title">
                                        📝 Cadangan Caption ({currentCaptionIndex + 1}/{captions.length})
                                    </h3>
                                    <button
                                        className={`copy-button ${copied ? 'copied' : ''}`}
                                        onClick={() => copyToClipboard(captions[currentCaptionIndex])}
                                    >
                                        {copied ? 'Disalin!' : 'Salin Caption'}
                                    </button>
                                </div>

                                <div className="caption-carousel">
                                    <button className="carousel-nav prev" onClick={handlePrevCaption}>
                                        &#8249;
                                    </button>

                                    <div className="caption-content">
                                        <p className="caption-text">{captions[currentCaptionIndex]}</p>
                                    </div>

                                    <button className="carousel-nav next" onClick={handleNextCaption}>
                                        &#8250;
                                    </button>
                                </div>

                                <div className="caption-dots">
                                    {captions.map((_, index) => (
                                        <span
                                            key={index}
                                            className={`dot ${index === currentCaptionIndex ? 'active' : ''}`}
                                            onClick={() => setCurrentCaptionIndex(index)}
                                        ></span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Day3_PhotoAnalysis;
