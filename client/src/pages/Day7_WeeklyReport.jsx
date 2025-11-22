import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Card from '../components/Card';
import confetti from 'canvas-confetti';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Download, CheckCircle, Star, Award } from 'lucide-react';
import html2canvas from 'html2canvas';
import './Day7_WeeklyReport.css';

const Day7_WeeklyReport = () => {
    const { user, updateUser } = useAuth();
    const [showConfetti, setShowConfetti] = useState(false);
    const certificateRef = useRef(null);

    useEffect(() => {
        if (!showConfetti) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#14b8a6', '#f59e0b', '#ec4899']
            });
            setShowConfetti(true);

            // Auto-completion removed. Completion is now triggered by certificate download.
        }
    }, []);

    const handleDownloadCertificate = async () => {
        if (certificateRef.current) {
            try {
                const canvas = await html2canvas(certificateRef.current, {
                    scale: 2, // Higher quality
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });

                const link = document.createElement('a');
                link.download = `Sijil-Digital-Sabah-${user.username}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();

                // Mark Day 7 as completed after download
                try {
                    const response = await userAPI.updateProgress(7);
                    if (response.data) {
                        updateUser({
                            ...user,
                            completedDays: response.data.completedDays,
                            currentDay: response.data.currentDay,
                            stats: response.data.stats,
                            badges: response.data.badges
                        });
                    }
                } catch (err) {
                    console.error("Failed to update progress:", err);
                }
            } catch (error) {
                console.error("Error generating certificate:", error);
                alert("Maaf, gagal download sijil. Sila cuba lagi.");
            }
        }
    };

    const data = [
        { name: 'H1', followers: 100 },
        { name: 'H2', followers: 120 },
        { name: 'H3', followers: 150 },
        { name: 'H4', followers: 180 },
        { name: 'H5', followers: 250 },
        { name: 'H6', followers: 300 },
        { name: 'H7', followers: 450 },
    ];

    return (
        <div className="weekly-report-container">
            <PageHeader
                title="Hari 7: Laporan Mingguan"
                subtitle="Analisis prestasi mingguan anda"
                backPath="/dashboard"
            />

            <div className="report-content">
                <div className="trophy-section">
                    <div className="trophy-circle">
                        <Trophy size={48} className="trophy-icon" />
                    </div>
                    <h2 className="congrats-title">Tahniah, {user?.username}! 🎉</h2>
                    <p className="congrats-subtitle">Anda telah tamatkan cabaran 7 hari!</p>
                </div>

                <div className="stats-card">
                    <h3 className="card-title">Pertumbuhan Pengikut</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <defs>
                                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="followers"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-box teal">
                        <p className="stat-value teal">7</p>
                        <p className="stat-label teal">Hari Konsisten</p>
                    </div>
                    <div className="stat-box orange">
                        <p className="stat-value orange">5</p>
                        <p className="stat-label orange">Skill Baru</p>
                    </div>
                </div>

                <button className="download-btn" onClick={handleDownloadCertificate}>
                    <Download size={22} />
                    Download Sijil Tamat
                </button>
            </div>

            {/* Hidden Certificate Template */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <div ref={certificateRef} className="certificate-template">
                    <div className="cert-border">
                        <div className="cert-header">
                            <Award size={64} className="cert-icon" />
                            <h1>Sijil Tamat Latihan</h1>
                            <p>Program Usahawan Digital Sabah</p>
                        </div>

                        <div className="cert-body">
                            <p className="cert-text">Dengan ini disahkan bahawa</p>
                            <h2 className="cert-name">{user?.username}</h2>
                            <p className="cert-business">({user?.businessName || 'Usahawan Digital'})</p>
                            <p className="cert-text">Telah berjaya menamatkan cabaran 7 hari dengan cemerlang.</p>

                            <div className="cert-achievements">
                                <h3>Pencapaian Mingguan:</h3>
                                <div className="achievement-grid">
                                    <div className="achievement-item">
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span>Profil Perniagaan</span>
                                    </div>
                                    <div className="achievement-item">
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span>Bio AI Dijana</span>
                                    </div>
                                    <div className="achievement-item">
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span>Analisis Foto Produk</span>
                                    </div>
                                    <div className="achievement-item">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={16} className="text-green-500" />
                                            <span>Latihan Chat: </span>
                                            <span className="font-bold text-blue-600 ml-1">{user?.day4Result?.grade || 'Selesai'}</span>
                                        </div>
                                    </div>
                                    <div className="achievement-item">
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span>Strategi Hashtag</span>
                                    </div>
                                    <div className="achievement-item">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle size={16} className="text-green-500" />
                                            <span>Rekaan Story: </span>
                                            <span className="font-bold text-blue-600 ml-1">{user?.day6Result?.grade || 'Selesai'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="cert-footer">
                            <div className="cert-signature">
                                <div className="sig-line"></div>
                                <p>Coach Digital Sabah</p>
                            </div>
                            <div className="cert-date">
                                <p>{new Date().toLocaleDateString('ms-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Day7_WeeklyReport;
