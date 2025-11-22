import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiAPI, userAPI } from '../utils/api';
import LoadingOverlay from '../components/LoadingOverlay';
import './Day2_BioGenerator.css';

const Day2_BioGenerator = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [generatedBios, setGeneratedBios] = useState([]);
    const [currentBio, setCurrentBio] = useState(user?.bio || '');
    const [selectedBio, setSelectedBio] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await aiAPI.generateBio({
                businessName: user?.businessName,
                niche: user?.niche,
                description: user?.description,
                currentBio
            });
            setGeneratedBios(response.data.bios || []);
            await userAPI.updateProgress(2);
            updateUser({ progress: Math.max(user.progress, 3) });
        } catch (error) {
            console.error('Error generating bio:', error);
            alert('Maaf, ada masalah. Sila cuba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBio = (bio) => {
        setSelectedBio(bio);
    };

    const handleCopyBio = (bio) => {
        navigator.clipboard.writeText(bio);
        alert('Bio telah disalin! Sila tampal ke Instagram anda.');
    };

    return (
        <div className="bio-generator-container">
            {loading && <LoadingOverlay message="AI sedang menulis bio untuk anda..." />}
            
            {/* Header */}
            <div className="bio-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    ← Kembali
                </button>
                <h1 className="bio-page-title">Bio Generator</h1>
                <p className="bio-page-subtitle">Jana bio menarik untuk bisnes anda</p>
            </div>

            <div className="bio-content">
                {/* Info Section */}
                <div className="bio-info-card">
                    <div className="info-icon">✨</div>
                    <div className="info-text">
                        <h2 className="info-title">Bio Yang Menarik</h2>
                        <p className="info-desc">Bio adalah "papan tanda" bisnes anda. Pastikan ia jelas dan menarik!</p>
                    </div>
                </div>

                {/* Input Section */}
                <div className="bio-input-section">
                    <label className="bio-label">
                        Bio Sedia Ada (Jika Ada)
                    </label>
                    <textarea
                        value={currentBio}
                        onChange={(e) => setCurrentBio(e.target.value)}
                        placeholder="Taip bio Instagram anda sekarang di sini... (Jika tiada, biarkan kosong)"
                        className="bio-textarea"
                        rows="4"
                    />
                    <p className="bio-hint">💡 Tip: Beritahu kami tentang bisnes anda untuk hasil lebih baik</p>
                </div>

                {/* Generate Button */}
                <button 
                    className="bio-generate-button"
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    <span className="button-icon">🤖</span>
                    <span className="button-text">Jana Bio Dengan AI</span>
                </button>

                {/* Generated Bios */}
                {generatedBios.length > 0 && (
                    <div className="bio-results-section">
                        <h3 className="results-title">📝 Pilihan Bio Untuk Anda:</h3>
                        
                        {generatedBios.map((bio, index) => (
                            <div 
                                key={index} 
                                className={`bio-result-card ${selectedBio === bio ? 'selected' : ''}`}
                            >
                                <div className="result-header">
                                    <span className="result-number">Pilihan {index + 1}</span>
                                    {selectedBio === bio && <span className="selected-badge">✓ Dipilih</span>}
                                </div>
                                <div className="result-bio-text">
                                    {bio}
                                </div>
                                <div className="result-actions">
                                    <button 
                                        className="action-button select-button"
                                        onClick={() => handleSelectBio(bio)}
                                    >
                                        {selectedBio === bio ? '✓ Dipilih' : 'Pilih Ini'}
                                    </button>
                                    <button 
                                        className="action-button copy-button"
                                        onClick={() => handleCopyBio(bio)}
                                    >
                                        📋 Salin
                                    </button>
                                </div>
                            </div>
                        ))}

                        {selectedBio && (
                            <div className="success-message">
                                <div className="success-icon">✅</div>
                                <div className="success-text">
                                    <p className="success-title">Bio Telah Dipilih!</p>
                                    <p className="success-desc">Klik butang "Salin" untuk copy, kemudian tampal ke Instagram anda.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {generatedBios.length === 0 && !loading && (
                    <div className="empty-state">
                        <div className="empty-icon">📱</div>
                        <p className="empty-text">Klik butang di atas untuk jana bio anda</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Day2_BioGenerator;
