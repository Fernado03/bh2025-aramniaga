import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

const Splash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="splash-container">
            <div className="splash-content">
                <div className="splash-logo">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M60 20L75 35L60 50L45 35L60 20Z" fill="white" opacity="0.9"/>
                        <path d="M35 45L50 60L35 75L20 60L35 45Z" fill="white" opacity="0.7"/>
                        <path d="M85 45L100 60L85 75L70 60L85 45Z" fill="white" opacity="0.7"/>
                        <path d="M60 70L75 85L60 100L45 85L60 70Z" fill="white"/>
                    </svg>
                </div>
                <h1 className="splash-title">PerniagaanDigital</h1>
                <p className="splash-subtitle">AI Coach untuk Usahawan 🤖</p>
                <div className="splash-loader">
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                </div>
            </div>
        </div>
    );
};

export default Splash;
