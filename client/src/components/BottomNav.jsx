import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Hash, User, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import './BottomNav.css';

const BottomNav = () => {
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    // Calculate progress based on completed days
    // Ensure progress is at least 1 because Day 1 (Registration) is implicitly done for logged-in users
    const rawProgress = user?.completedDays?.length || 0;
    const progress = Math.max(rawProgress, 1);

    const handleNavClick = (e, requiredProgress, featureName, dayRequired) => {
        if (progress < requiredProgress) {
            e.preventDefault();
            enqueueSnackbar(
                `🔒 ${featureName} terkunci! Selesaikan Hari ${dayRequired} dahulu.`,
                { variant: 'warning', autoHideDuration: 3000 }
            );
        }
    };

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-container">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <div className="nav-icon-wrapper">
                        <Home size={24} strokeWidth={2.5} />
                    </div>
                    <span className="nav-label">Home</span>
                </NavLink>

                <NavLink
                    to="/day/3"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''} ${progress < 2 ? 'locked' : ''}`
                    }
                    onClick={(e) => handleNavClick(e, 2, 'Post', 2)}
                >
                    <div className="nav-icon-wrapper">
                        <Camera size={24} strokeWidth={2.5} />
                    </div>
                    <span className="nav-label">Post</span>
                </NavLink>

                <NavLink
                    to="/day/5"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''} ${progress < 4 ? 'locked' : ''}`
                    }
                    onClick={(e) => handleNavClick(e, 4, 'Caption', 4)}
                >
                    <div className="nav-icon-wrapper">
                        <Hash size={24} strokeWidth={2.5} />
                    </div>
                    <span className="nav-label">Caption</span>
                </NavLink>

                <NavLink
                    to="/day/4"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''} ${progress < 3 ? 'locked' : ''}`
                    }
                    onClick={(e) => handleNavClick(e, 3, 'Chat', 3)}
                >
                    <div className="nav-icon-wrapper">
                        <MessageSquare size={24} strokeWidth={2.5} />
                    </div>
                    <span className="nav-label">Chat</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''} ${progress < 1 ? 'locked' : ''}`
                    }
                    onClick={(e) => handleNavClick(e, 1, 'Profil', 1)}
                >
                    <div className="nav-icon-wrapper">
                        <User size={24} strokeWidth={2.5} />
                    </div>
                    <span className="nav-label">Profil</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
