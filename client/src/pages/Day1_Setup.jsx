import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import './Day1_Setup.css';

const Day1_Setup = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(user?.businessName ? 3 : 0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: user?.businessName || '',
        description: user?.description || '',
        niche: user?.niche || 'General'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (step === 1 && !formData.businessName.trim()) return;
        if (step === 2 && !formData.description.trim()) return;
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            await userAPI.updateProfile(formData);
            // Update progress to unlock Day 2 (progress = 1 means Day 1 done, Day 2 unlocked? 
            // Usually progress 0 -> Day 1. Progress 1 -> Day 2 unlocked.
            // The old code used updateProgress(1) and Math.max(user.progress, 2).
            // Let's stick to that logic.
            await userAPI.updateProgress(1);
            updateUser({ ...formData, progress: Math.max(user.progress || 0, 2) });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Maaf, ada masalah. Sila cuba lagi.');
            setLoading(false);
        }
    };

    return (
        <div className="day1-container">
            <div className="chat-wrapper">
                {/* Step 0: Intro */}
                {step === 0 && (
                    <div className="chat-step fade-in">
                        <div className="ai-message">
                            <span className="ai-avatar">🤖</span>
                            <div className="message-bubble">
                                <h2>Hi, nice to meet you! 👋</h2>
                                <p>I'm your AI business assistant. Let's get your profile set up.</p>
                            </div>
                        </div>
                        <button className="action-button" onClick={nextStep}>
                            Let's Start
                        </button>
                    </div>
                )}

                {/* Step 1: Business Name */}
                {step === 1 && (
                    <div className="chat-step fade-in">
                        <div className="ai-message">
                            <span className="ai-avatar">🤖</span>
                            <div className="message-bubble">
                                <p>Tell me your company name.</p>
                            </div>
                        </div>
                        <div className="user-input-area">
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Type your company name..."
                                className="chat-input"
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && nextStep()}
                            />
                            <button
                                className="action-button"
                                onClick={nextStep}
                                disabled={!formData.businessName.trim()}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Description */}
                {step === 2 && (
                    <div className="chat-step fade-in">
                        <div className="ai-message">
                            <span className="ai-avatar">🤖</span>
                            <div className="message-bubble">
                                <p>Wow hi <strong>{formData.businessName}</strong>! Care to explain about your company?</p>
                            </div>
                        </div>
                        <div className="user-input-area">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="What do you sell? Who are your customers?"
                                className="chat-textarea"
                                autoFocus
                                rows={4}
                            />
                            <div className="button-group">
                                <button className="secondary-button" onClick={prevStep}>Back</button>
                                <button
                                    className="action-button"
                                    onClick={nextStep}
                                    disabled={!formData.description.trim()}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div className="chat-step fade-in">
                        <div className="ai-message">
                            <span className="ai-avatar">🤖</span>
                            <div className="message-bubble">
                                <p>Does all of this information look correct?</p>
                            </div>
                        </div>

                        <div className="review-card">
                            <div className="review-item">
                                <label>Company Name</label>
                                <p>{formData.businessName}</p>
                            </div>
                            <div className="review-item">
                                <label>Description</label>
                                <p>{formData.description}</p>
                            </div>
                        </div>

                        <div className="review-actions">
                            <div className="main-buttons">
                                <button className="secondary-button" onClick={() => setStep(1)}>
                                    Edit Details
                                </button>
                                <button
                                    className="action-button"
                                    onClick={handleComplete}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (user?.businessName ? 'Save Changes' : 'Complete Setup')}
                                </button>
                            </div>

                            {user?.businessName && (
                                <button className="ghost-button" onClick={() => navigate('/dashboard')}>
                                    ← Back to Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Day1_Setup;
