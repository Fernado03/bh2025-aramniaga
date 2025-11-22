import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiAPI, userAPI } from '../utils/api';
import './Day4_ChatCoach.css';

const Day4_ChatCoach = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { text: "Barang saya rosak! Saya nak refund sekarang!!! 😡", isUser: false, isCustomer: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
        setInput('');
        setLoading(true);

        try {
            const response = await aiAPI.chatCoach({
                message: userMessage,
                scenario: "angry_customer_refund"
            });

            setFeedback(response.data);
            
            // Add AI feedback as a system message
            setMessages(prev => [...prev, {
                text: response.data.feedback,
                isUser: false,
                isAI: true,
                grade: response.data.grade
            }]);

            await userAPI.updateProgress(4);
            updateUser({ progress: Math.max(user.progress, 5) });
        } catch (error) {
            console.error('Error getting coaching:', error);
            alert('Maaf, ada masalah. Sila cuba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([
            { text: "Barang saya rosak! Saya nak refund sekarang!!! 😡", isUser: false, isCustomer: true }
        ]);
        setFeedback(null);
        setInput('');
    };

    return (
        <div className="chat-coach-container">
            {/* Header */}
            <div className="chat-header">
                <div className="header-top">
                    <button className="back-button" onClick={() => navigate('/dashboard')}>
                        ←
                    </button>
                    <div className="header-title-section">
                        <h1 className="chat-page-title">Chat Coach</h1>
                        <p className="chat-page-subtitle">Belajar balas pelanggan dengan baik</p>
                    </div>
                </div>
            </div>

            {/* Scenario Info */}
            <div className="scenario-info">
                <div className="scenario-icon">⚠️</div>
                <div className="scenario-text">
                    <p className="scenario-title">Situasi:</p>
                    <p className="scenario-desc">Pelanggan marah sebab barang rosak. Cuba balas dengan tenang dan profesional.</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg.isUser ? 'user' : 'other'}`}>
                        {msg.isCustomer && (
                            <div className="message-bubble customer-bubble">
                                <div className="customer-label">👤 Pelanggan</div>
                                <div className="message-text">{msg.text}</div>
                            </div>
                        )}
                        
                        {msg.isUser && !msg.isCustomer && !msg.isAI && (
                            <div className="message-bubble user-bubble">
                                <div className="message-text">{msg.text}</div>
                            </div>
                        )}
                        
                        {msg.isAI && (
                            <div className="message-bubble ai-bubble">
                                <div className="ai-header">
                                    <span className="ai-label">🤖 AI Coach</span>
                                    <span className="ai-grade">Gred: {msg.grade}</span>
                                </div>
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
                            <div className="loading-text">AI sedang menyemak jawapan anda...</div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
                {feedback ? (
                    <button 
                        className="reset-button"
                        onClick={handleReset}
                    >
                        🔄 Cuba Lagi
                    </button>
                ) : (
                    <form onSubmit={handleSend} className="chat-form">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Tulis balasan anda di sini..."
                            className="chat-input"
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            disabled={loading || !input.trim()} 
                            className="send-button"
                        >
                            ➤
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Day4_ChatCoach;
