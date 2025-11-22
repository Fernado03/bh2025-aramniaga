import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiAPI, userAPI } from '../utils/api';
import './Day4_ChatCoach.css';

import PageHeader from '../components/PageHeader';

const SCENARIOS = [
    {
        id: 'angry_refund',
        title: 'Barang Rosak',
        icon: '😡',
        description: 'Pelanggan marah sebab barang sampai pecah/rosak.',
        initialMessage: "Barang saya rosak! Saya nak refund sekarang!!! 😡",
        difficulty: 'Sukar',
        proofImage: '/images/broken_package.png'
    },
    {
        id: 'price_inquiry',
        title: 'Tanya Harga',
        icon: '💰',
        description: 'Pelanggan berminat tapi rasa harga mahal.',
        initialMessage: "Hi, berapa harga ni? Boleh kurang lagi tak?",
        difficulty: 'Sederhana'
    },
    {
        id: 'late_delivery',
        title: 'Lambat Sampai',
        icon: '🚚',
        description: 'Pelanggan bising barang tak sampai-sampai.',
        initialMessage: "Dah seminggu order tak sampai pun! Scam ke ni??",
        difficulty: 'Sukar'
    },
    {
        id: 'wrong_item',
        title: 'Salah Item',
        icon: '📦',
        description: 'Pelanggan dapat barang yang salah.',
        initialMessage: "Saya order warna biru, kenapa dapat merah??",
        difficulty: 'Sederhana'
    }
];

const Day4_ChatCoach = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [selectedScenario, setSelectedScenario] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [grading, setGrading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, grading]);

    const handleScenarioSelect = (scenario) => {
        setSelectedScenario(scenario);
        setMessages([
            { text: scenario.initialMessage, isUser: false, isCustomer: true }
        ]);
        setFeedback(null);
        setInput('');
    };

    const handleSurprise = async () => {
        setLoading(true);
        try {
            const response = await aiAPI.generateScenario();
            const newScenario = response.data;
            handleScenarioSelect(newScenario);
        } catch (error) {
            console.error('Error generating scenario:', error);
            alert('Maaf, gagal menjana situasi misteri. Sila cuba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        // Add user message to UI immediately
        const newMessages = [...messages, { text: userMessage, isUser: true }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            // Call AI Customer to get a reply
            const response = await aiAPI.chatCustomer({
                scenario: selectedScenario,
                history: newMessages,
                userMessage: userMessage
            });

            const aiReply = {
                text: response.data.reply,
                isUser: false,
                isCustomer: true
            };

            // Handle AI Action (e.g., send proof)
            if (response.data.action === 'send_proof') {
                // Use dynamic image if provided by backend, otherwise fallback to static scenario image
                if (response.data.action_image) {
                    aiReply.image = response.data.action_image;
                } else if (selectedScenario.proofImage) {
                    aiReply.image = selectedScenario.proofImage;
                }
            }

            setMessages(prev => [...prev, aiReply]);

        } catch (error) {
            console.error('Error getting customer reply:', error);
            // Fallback message if AI fails
            setMessages(prev => [...prev, {
                text: "Maaf, line tak berapa clear. Boleh ulang?",
                isUser: false,
                isCustomer: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleEndSession = async () => {
        setGrading(true);
        try {
            const response = await aiAPI.chatCoach({
                scenario: selectedScenario,
                history: messages
            });

            setFeedback(response.data);

            // Update progress if grade is good
            if (['A', 'B', 'C'].includes(response.data.grade)) {
                await userAPI.updateProgress(4);
                updateUser({ progress: Math.max(user.progress, 5) });
            }

        } catch (error) {
            console.error('Error grading session:', error);
            alert('Maaf, ada masalah nak kira markah. Sila cuba lagi.');
        } finally {
            setGrading(false);
        }
    };

    const handleReset = () => {
        if (selectedScenario) {
            setMessages([
                { text: selectedScenario.initialMessage, isUser: false, isCustomer: true }
            ]);
            setFeedback(null);
            setInput('');
        }
    };

    const handleChangeScenario = () => {
        setSelectedScenario(null);
        setMessages([]);
        setFeedback(null);
        setInput('');
    };

    return (
        <div className="chat-coach-container">
            <PageHeader
                title="Chat Coach"
                subtitle="Belajar balas pelanggan dengan baik"
                onBack={() => selectedScenario ? handleChangeScenario() : navigate('/dashboard')}
            />

            {!selectedScenario ? (
                <div className="scenarios-grid">
                    <h2 className="section-title">Pilih Situasi:</h2>
                    {SCENARIOS.map((scenario) => (
                        <div
                            key={scenario.id}
                            className="scenario-card"
                            onClick={() => handleScenarioSelect(scenario)}
                        >
                            <div className="scenario-card-icon">{scenario.icon}</div>
                            <div className="scenario-card-content">
                                <h3 className="scenario-card-title">{scenario.title}</h3>
                                <p className="scenario-card-desc">{scenario.description}</p>
                                <span className={`difficulty-badge ${scenario.difficulty.toLowerCase()}`}>
                                    {scenario.difficulty}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Surprise Me Button */}
                    <div
                        className="scenario-card surprise-card"
                        onClick={handleSurprise}
                        style={{ border: '2px dashed #a855f7', background: '#faf5ff' }}
                    >
                        <div className="scenario-card-icon" style={{ background: '#f3e8ff' }}>✨</div>
                        <div className="scenario-card-content">
                            <h3 className="scenario-card-title" style={{ color: '#7e22ce' }}>Situasi Misteri</h3>
                            <p className="scenario-card-desc">Biar AI tentukan nasib anda! Situasi rawak yang mencabar.</p>
                            {loading && <span className="difficulty-badge" style={{ background: '#e9d5ff', color: '#7e22ce' }}>Generating...</span>}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Scenario Info */}
                    <div className="scenario-info">
                        <div className="scenario-icon">{selectedScenario.icon}</div>
                        <div className="scenario-text">
                            <p className="scenario-title">Situasi: {selectedScenario.title}</p>
                            <p className="scenario-desc">{selectedScenario.description}</p>
                        </div>
                        <button className="change-scenario-btn" onClick={handleChangeScenario}>
                            Tukar
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.isUser ? 'user' : 'other'}`}>
                                {msg.isCustomer && (
                                    <div className="message-bubble customer-bubble">
                                        <div className="customer-label">👤 Pelanggan</div>
                                        <div className="message-text">{msg.text}</div>
                                        {msg.image && (
                                            <img
                                                src={msg.image}
                                                alt="Bukti Kerosakan"
                                                className="chat-proof-image"
                                                onClick={() => window.open(msg.image, '_blank')}
                                            />
                                        )}
                                    </div>
                                )}

                                {msg.isUser && (
                                    <div className="message-bubble user-bubble">
                                        <div className="message-text">{msg.text}</div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="message-wrapper other">
                                <div className="message-bubble loading-bubble">
                                    <div className="loading-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <div className="loading-text">Pelanggan sedang menaip...</div>
                                </div>
                            </div>
                        )}

                        {grading && (
                            <div className="grading-overlay">
                                <div className="loading-spinner"></div>
                                <p>Coach sedang menyemak perbualan anda...</p>
                            </div>
                        )}

                        {feedback && (
                            <div className="feedback-result">
                                <div className="feedback-header">
                                    <div className="feedback-grade">Gred: {feedback.grade}</div>
                                    <div className="feedback-title">Ulasan Coach:</div>
                                </div>
                                <p className="feedback-text">{feedback.feedback}</p>
                                {feedback.tips && (
                                    <div className="feedback-tips">
                                        <strong>💡 Tip:</strong> {feedback.tips}
                                    </div>
                                )}
                                <div className="feedback-actions">
                                    <button className="reset-button" onClick={handleReset}>
                                        🔄 Cuba Lagi
                                    </button>
                                    <button className="new-scenario-button" onClick={handleChangeScenario}>
                                        Situasi Lain
                                    </button>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    {!feedback && (
                        <div className="chat-input-area">
                            {messages.length > 2 && !loading && (
                                <button
                                    className="end-session-btn"
                                    onClick={handleEndSession}
                                >
                                    🛑 Tamatkan & Nilai
                                </button>
                            )}

                            <form onSubmit={handleSend} className="chat-form">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Tulis balasan anda di sini..."
                                    className="chat-input"
                                    disabled={loading || grading}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={loading || grading || !input.trim()}
                                    className="send-button"
                                >
                                    ➤
                                </button>
                            </form>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Day4_ChatCoach;
