import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Hash, User, Camera } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
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
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <div className="nav-icon-wrapper">
                        <Camera size={24} strokeWidth={2.5} />
                    </div>
                    <span className="nav-label">Post</span>
                </NavLink>

                <NavLink
                    to="/day/5"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <div className="nav-icon-wrapper">
                        <Hash size={24} strokeWidth={2.5} />
                    </div>
                    <span className="nav-label">Caption</span>
                </NavLink>

                <NavLink
                    to="/day/4"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <div className="nav-icon-wrapper">
                        <MessageSquare size={24} strokeWidth={2.5} />
                    </div>
                    <span className="nav-label">Chat</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
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
