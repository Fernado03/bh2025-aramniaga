import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import { aiAPI, userAPI } from '../utils/api';
import './Day2_BioGenerator.css';

import PageHeader from '../components/PageHeader';

const Day2_BioGenerator = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [generatedBios, setGeneratedBios] = useState([]);
    const [currentBioIndex, setCurrentBioIndex] = useState(0);
    const [currentBio, setCurrentBio] = useState(user?.bio || '');
    const [selectedBio, setSelectedBio] = useState('');

    // Update local state when user data is loaded
    React.useEffect(() => {
        if (user?.bio) {
            setCurrentBio(user.bio);
        }
    }, [user?.bio]);

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
            setCurrentBioIndex(0);
            await userAPI.updateProgress(2);
            updateUser({
                progress: Math.max(user.progress, 3),
                bio: currentBio
            });
        } catch (error) {
            console.error('Error generating bio:', error);
            enqueueSnackbar('Maaf, ada masalah. Sila cuba lagi.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBio = (bio) => {
        setSelectedBio(bio);
        enqueueSnackbar('Bio Telah Dipilih! Klik butang "Salin" untuk copy.', { variant: 'success' });
    };

    const handleCopyBio = (bio) => {
        navigator.clipboard.writeText(bio);
        enqueueSnackbar('Bio telah disalin! Sila tampal ke Instagram anda.', { variant: 'success' });
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const handleStartEdit = () => {
        setEditValue(generatedBios[currentBioIndex]);
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        const newBios = [...generatedBios];
        newBios[currentBioIndex] = editValue;
        setGeneratedBios(newBios);
        setIsEditing(false);
        enqueueSnackbar('Bio berjaya dikemaskini!', { variant: 'success' });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handlePrevBio = () => {
        if (isEditing) handleCancelEdit();
        setCurrentBioIndex((prev) => (prev > 0 ? prev - 1 : generatedBios.length - 1));
    };

    const handleNextBio = () => {
        if (isEditing) handleCancelEdit();
        setCurrentBioIndex((prev) => (prev < generatedBios.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="bio-generator-container">

            <PageHeader
                title="Bio Generator"
                subtitle="Jana bio menarik untuk bisnes anda"
                backPath="/dashboard"
            />

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
                    <div className="textarea-container">
                        <textarea
                            value={currentBio}
                            onChange={(e) => setCurrentBio(e.target.value)}
                            placeholder="Taip bio Instagram anda sekarang... (Contoh: No telefon, link website, slogan, atau servis yang ditawarkan)"
                            className="bio-textarea"
                            rows="4"
                            disabled={loading}
                        />
                        {loading && (
                            <div className="textarea-loading-overlay">
                                <div className="loading-spinner"></div>
                                <p>AI sedang menulis bio...</p>
                            </div>
                        )}
                    </div>
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

                        <div className="bio-carousel">
                            <button className="carousel-nav prev" onClick={handlePrevBio}>
                                &#8249;
                            </button>

                            <div className="bio-result-card active">
                                <div className="result-header">
                                    <span className="result-number">Pilihan {currentBioIndex + 1} dari {generatedBios.length}</span>
                                    {selectedBio === generatedBios[currentBioIndex] && <span className="selected-badge">✓ Dipilih</span>}
                                </div>
                                {isEditing ? (
                                    <textarea
                                        className="edit-bio-textarea"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        rows="6"
                                    />
                                ) : (
                                    <div className="result-bio-text">
                                        {generatedBios[currentBioIndex]}
                                    </div>
                                )}

                                <div className="result-actions">
                                    {isEditing ? (
                                        <>
                                            <button
                                                className="action-button save-button"
                                                onClick={handleSaveEdit}
                                            >
                                                💾 Simpan
                                            </button>
                                            <button
                                                className="action-button cancel-button"
                                                onClick={handleCancelEdit}
                                            >
                                                ❌ Batal
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="action-button edit-button"
                                                onClick={handleStartEdit}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="action-button select-button"
                                                onClick={() => handleSelectBio(generatedBios[currentBioIndex])}
                                            >
                                                {selectedBio === generatedBios[currentBioIndex] ? '✓ Dipilih' : 'Pilih Ini'}
                                            </button>
                                            <button
                                                className="action-button copy-button"
                                                onClick={() => handleCopyBio(generatedBios[currentBioIndex])}
                                            >
                                                📋 Salin
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button className="carousel-nav next" onClick={handleNextBio}>
                                &#8250;
                            </button>
                        </div>


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
