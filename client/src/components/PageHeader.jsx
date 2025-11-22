import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageHeader.css';

const PageHeader = ({ title, subtitle, backPath = '/dashboard', onBack }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(backPath);
        }
    };

    return (
        <div className="page-header">
            <div className="header-top">
                <button className="back-button" onClick={handleBack}>
                    ←
                </button>
                <div className="header-title-section">
                    <h1 className="page-title">{title}</h1>
                    {subtitle && <p className="page-subtitle">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
