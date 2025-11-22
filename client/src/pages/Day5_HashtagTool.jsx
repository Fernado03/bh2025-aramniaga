import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiAPI, userAPI } from '../utils/api';

import './Day5_HashtagTool.css';

import PageHeader from '../components/PageHeader';

const Day5_HashtagTool = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        setLoading(true);
        try {
            const response = await aiAPI.generateHashtags({
                keyword,
                niche: user?.niche
            });
            setHashtags(response.data.hashtags || []);
            await userAPI.updateProgress(5);
            updateUser({
                progress: Math.max(user.progress, 6),
                generatedHashtags: response.data.hashtags || []
            });
        } catch (error) {
            console.error('Error generating hashtags:', error);
            alert('Maaf, ada masalah. Sila cuba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyAll = () => {
        const allTags = hashtags.join(' ');
        navigator.clipboard.writeText(allTags);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyTag = (tag) => {
        navigator.clipboard.writeText(tag);
    };

    return (
        <div className="hashtag-tool-container">


            <PageHeader
                title="Caption Generator"
                subtitle="Jana hashtag untuk posting anda"
                backPath="/dashboard"
            />

            {/* Content */}
            <div className="hashtag-content">
                {/* Info Card */}
                <div className="info-card">
                    <div className="info-icon">🚀</div>
                    <div className="info-text">
                        <h2 className="info-title">Hashtag Viral</h2>
                        <p className="info-desc">Cari hashtag yang relevan untuk naikkan reach posting anda!</p>
                    </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleGenerate} className="hashtag-form">
                    <div className="form-group">
                        <label className="form-label">Topik Posting Anda</label>
                        <div className="input-container">
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Contoh: Resepi Kek Batik"
                                className="form-input"
                                required
                                disabled={loading}
                            />
                            {loading && (
                                <div className="input-loading-overlay">
                                    <div className="loading-spinner"></div>
                                    <p>AI sedang mencari hashtag...</p>
                                </div>
                            )}
                        </div>
                        <p className="form-hint">💡 Tip: Taip tentang apa posting anda</p>
                    </div>

                    <button
                        type="submit"
                        className="generate-button"
                        disabled={loading}
                    >
                        <span className="button-icon">#</span>
                        <span className="button-text">Jana Hashtag</span>
                    </button>
                </form>

                {/* Results */}
                {hashtags.length > 0 && (
                    <div className="results-section">
                        <div className="results-header">
                            <h3 className="results-title">📝 Hashtag Dicadangkan:</h3>
                            <button
                                className={`copy-all-button ${copied ? 'copied' : ''}`}
                                onClick={handleCopyAll}
                            >
                                {copied ? '✓ Disalin!' : '📋 Salin Semua'}
                            </button>
                        </div>

                        <div className="hashtags-grid">
                            {hashtags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="hashtag-tag"
                                    onClick={() => handleCopyTag(tag)}
                                >
                                    <span className="tag-icon">#</span>
                                    <span className="tag-text">{tag.replace('#', '')}</span>
                                </div>
                            ))}
                        </div>

                        <div className="success-message">
                            <div className="success-icon">✅</div>
                            <div className="success-text">
                                <p className="success-title">Hashtag Telah Dijana!</p>
                                <p className="success-desc">Klik pada mana-mana hashtag untuk menyalin, atau klik "Salin Semua" di atas.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {hashtags.length === 0 && !loading && (
                    <div className="empty-state">
                        <div className="empty-icon">#️⃣</div>
                        <p className="empty-text">Masukkan topik posting anda untuk jana hashtag</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Day5_HashtagTool;
