import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, aiAPI } from '../utils/api';
import { fileToBase64 } from '../utils/helpers';
import PageHeader from '../components/PageHeader';
import { Upload, Download, Type, Smile, Hash, X, Wand2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import './Day6_StoryCanvas.css';

const COLORS = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const EMOJIS = ['🔥', '❤️', '😍', '😂', '👍', '🎉', '✨', '🍔', '🍕', '🥗', '☕', '🥤', '🏷️', '💰', '💯', '✅'];

const Day6_StoryCanvas = () => {
    const { user, updateUser } = useAuth();
    const [background, setBackground] = useState(null);
    const [stickers, setStickers] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [fontSize, setFontSize] = useState(24);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showHashtagPicker, setShowHashtagPicker] = useState(false);
    const [generatedHashtags, setGeneratedHashtags] = useState([]);
    const [selectedStickerId, setSelectedStickerId] = useState(null);

    // Interaction State
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [activeOperation, setActiveOperation] = useState(null); // 'move', 'rotate', 'resize'

    // Evaluation State
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [showEvaluation, setShowEvaluation] = useState(false);

    const canvasRef = useRef(null);

    useEffect(() => {
        if (user?.generatedHashtags) {
            setGeneratedHashtags(user.generatedHashtags);
        }
    }, [user]);

    // Update selected sticker when color/size changes
    useEffect(() => {
        if (selectedStickerId) {
            setStickers(stickers.map(s =>
                s.id === selectedStickerId
                    ? { ...s, color: selectedColor, fontSize: fontSize }
                    : s
            ));
        }
    }, [selectedColor, fontSize, selectedStickerId]);

    const handleBackgroundUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setBackground(base64);
        }
    };

    const addSticker = (text) => {
        const newId = Date.now();
        setStickers([...stickers, {
            id: newId,
            text,
            x: 50,
            y: 50,
            color: selectedColor,
            fontSize: fontSize,
            rotation: 0
        }]);
        setSelectedStickerId(newId);
        setShowEmojiPicker(false);
        setShowHashtagPicker(false);
    };

    const handleStickerClick = (e, id) => {
        e.stopPropagation();
        setSelectedStickerId(id);
        const sticker = stickers.find(s => s.id === id);
        if (sticker) {
            setSelectedColor(sticker.color);
            setFontSize(sticker.fontSize);
        }
    };

    const handleStickerDoubleClick = (e, id) => {
        e.stopPropagation();
        const sticker = stickers.find(s => s.id === id);
        if (sticker) {
            const newText = prompt("Edit teks:", sticker.text);
            if (newText !== null && newText.trim() !== "") {
                setStickers(stickers.map(s =>
                    s.id === id ? { ...s, text: newText } : s
                ));
            }
        }
    };

    const handleDeleteSticker = () => {
        if (selectedStickerId) {
            setStickers(stickers.filter(s => s.id !== selectedStickerId));
            setSelectedStickerId(null);
        }
    };

    const handleCanvasClick = () => {
        setSelectedStickerId(null);
    };

    // --- Interaction Handlers ---

    const handleMouseDown = (e, id, operation) => {
        e.stopPropagation();
        setActiveOperation(operation);
        setSelectedStickerId(id);
        setDragStart({ x: e.clientX, y: e.clientY });
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !selectedStickerId) return;

        const sticker = stickers.find(s => s.id === selectedStickerId);
        if (!sticker) return;

        const rect = canvasRef.current.getBoundingClientRect();

        if (activeOperation === 'move') {
            const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
            const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

            setStickers(stickers.map(s =>
                s.id === selectedStickerId
                    ? { ...s, x: s.x + deltaX, y: s.y + deltaY }
                    : s
            ));
            setDragStart({ x: e.clientX, y: e.clientY });
        } else if (activeOperation === 'rotate') {
            const stickerEl = document.getElementById(`sticker-${selectedStickerId}`);
            if (stickerEl) {
                const stickerRect = stickerEl.getBoundingClientRect();
                const centerX = stickerRect.left + stickerRect.width / 2;
                const centerY = stickerRect.top + stickerRect.height / 2;

                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                const rotation = angle + 90;

                setStickers(stickers.map(s =>
                    s.id === selectedStickerId ? { ...s, rotation } : s
                ));
            }
        } else if (activeOperation === 'resize') {
            const deltaY = dragStart.y - e.clientY;
            const newSize = Math.max(12, Math.min(72, sticker.fontSize + (deltaY * 0.5)));

            setStickers(stickers.map(s =>
                s.id === selectedStickerId ? { ...s, fontSize: newSize } : s
            ));
            setFontSize(newSize);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setActiveOperation(null);
    };

    // --- Touch Handlers (Mobile Support) ---

    const handleTouchStart = (e, id, operation) => {
        e.stopPropagation();
        // Don't prevent default here to allow scrolling if not hitting a target, 
        // but for stickers we might want to.
        setActiveOperation(operation);
        setSelectedStickerId(id);
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX, y: touch.clientY });
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !selectedStickerId) return;
        e.preventDefault(); // Prevent scrolling while dragging

        const touch = e.touches[0];
        const sticker = stickers.find(s => s.id === selectedStickerId);
        if (!sticker) return;

        const rect = canvasRef.current.getBoundingClientRect();

        if (activeOperation === 'move') {
            const deltaX = ((touch.clientX - dragStart.x) / rect.width) * 100;
            const deltaY = ((touch.clientY - dragStart.y) / rect.height) * 100;

            setStickers(stickers.map(s =>
                s.id === selectedStickerId
                    ? { ...s, x: s.x + deltaX, y: s.y + deltaY }
                    : s
            ));
            setDragStart({ x: touch.clientX, y: touch.clientY });
        } else if (activeOperation === 'rotate') {
            const stickerEl = document.getElementById(`sticker-${selectedStickerId}`);
            if (stickerEl) {
                const stickerRect = stickerEl.getBoundingClientRect();
                const centerX = stickerRect.left + stickerRect.width / 2;
                const centerY = stickerRect.top + stickerRect.height / 2;

                const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
                const rotation = angle + 90;

                setStickers(stickers.map(s =>
                    s.id === selectedStickerId ? { ...s, rotation } : s
                ));
            }
        } else if (activeOperation === 'resize') {
            const deltaY = dragStart.y - touch.clientY;
            const newSize = Math.max(12, Math.min(72, sticker.fontSize + (deltaY * 0.5)));

            setStickers(stickers.map(s =>
                s.id === selectedStickerId ? { ...s, fontSize: newSize } : s
            ));
            setFontSize(newSize);
            setDragStart({ x: touch.clientX, y: touch.clientY });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setActiveOperation(null);
    };

    const handleEvaluate = async () => {
        if (!canvasRef.current) return;

        setIsEvaluating(true);
        const currentSelection = selectedStickerId;
        setSelectedStickerId(null);

        setTimeout(async () => {
            try {
                const canvas = await html2canvas(canvasRef.current);
                const imageBase64 = canvas.toDataURL('image/png');

                const result = await aiAPI.evaluateStory(imageBase64);
                setEvaluationResult(result.data);

                // Unlock Day 7
                const progressResponse = await userAPI.updateProgress(6);
                updateUser({
                    progress: Math.max(user.progress, 7),
                    completedDays: progressResponse.data.completedDays,
                    currentDay: progressResponse.data.currentDay,
                    stats: progressResponse.data.stats,
                    badges: progressResponse.data.badges,
                    day6Result: result.data
                });

                setShowEvaluation(true);
            } catch (error) {
                console.error("Evaluation failed", error);
                alert("Maaf, AI tidak dapat menilai story anda buat masa ini.");
            } finally {
                setIsEvaluating(false);
                setSelectedStickerId(currentSelection);
            }
        }, 100);
    };

    const handleDownload = async () => {
        if (canvasRef.current) {
            setSelectedStickerId(null);
            setTimeout(async () => {
                const canvas = await html2canvas(canvasRef.current);
                const link = document.createElement('a');
                link.download = 'story-design.png';
                link.href = canvas.toDataURL();
                link.click();

                const progressResponse = await userAPI.updateProgress(6);
                updateUser({
                    progress: Math.max(user.progress, 7),
                    completedDays: progressResponse.data.completedDays,
                    currentDay: progressResponse.data.currentDay,
                    stats: progressResponse.data.stats,
                    badges: progressResponse.data.badges
                });
                setShowEvaluation(false);
            }, 100);
        }
    };

    return (
        <div
            className="story-canvas-container"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            <PageHeader
                title="Hari 6: Story Canvas"
                subtitle="Design story Instagram anda"
                backPath="/dashboard"
            />

            <div className="story-content">
                {/* Tools Panel */}
                <div className="tools-panel" onClick={(e) => e.stopPropagation()}>
                    <div className="tool-group">
                        <div className="flex justify-between items-center mb-2">
                            <label className="tool-label mb-0">Warna Teks</label>
                            {selectedStickerId && (
                                <button onClick={handleDeleteSticker} className="text-red-500 text-xs font-bold flex items-center gap-1">
                                    <X size={14} /> Buang
                                </button>
                            )}
                        </div>
                        <div className="color-options">
                            {COLORS.map(color => (
                                <div
                                    key={color}
                                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="tool-group">
                        <label className="tool-label">Saiz Teks: {Math.round(fontSize)}px</label>
                        <input
                            type="range"
                            min="12"
                            max="72"
                            value={fontSize}
                            onChange={(e) => {
                                const newSize = parseInt(e.target.value);
                                setFontSize(newSize);
                                if (selectedStickerId) {
                                    setStickers(stickers.map(s =>
                                        s.id === selectedStickerId ? { ...s, fontSize: newSize } : s
                                    ));
                                }
                            }}
                            className="size-slider"
                        />
                    </div>
                </div>

                {/* Toolbar */}
                <div className="story-toolbar" onClick={(e) => e.stopPropagation()}>
                    <label className="toolbar-btn">
                        <Upload size={18} />
                        <span>Background</span>
                        <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
                    </label>
                    <button onClick={() => addSticker("Teks Menu")} className="toolbar-btn">
                        <Type size={18} />
                        <span>+ Teks</span>
                    </button>
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="toolbar-btn">
                        <Smile size={18} />
                        <span>+ Emoji</span>
                    </button>
                    <button onClick={() => setShowHashtagPicker(!showHashtagPicker)} className="toolbar-btn">
                        <Hash size={18} />
                        <span>+ Hashtag</span>
                    </button>
                </div>

                {/* Pickers */}
                {showEmojiPicker && (
                    <div className="tools-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="picker-grid">
                            {EMOJIS.map(emoji => (
                                <div key={emoji} className="picker-item" onClick={() => addSticker(emoji)}>
                                    {emoji}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showHashtagPicker && (
                    <div className="tools-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="picker-grid">
                            {generatedHashtags.length > 0 ? (
                                generatedHashtags.map((tag, index) => (
                                    <div key={index} className="hashtag-item" onClick={() => addSticker(tag)}>
                                        {tag}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 col-span-full p-2">Tiada hashtag dari Hari 5.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Canvas */}
                <div
                    ref={canvasRef}
                    className="canvas-wrapper"
                >
                    {background ? (
                        <>
                            <div
                                className="story-background-blur"
                                style={{ backgroundImage: `url(${background})` }}
                            />
                            <img src={background} alt="Background" className="story-background-img" />
                        </>
                    ) : (
                        <div className="canvas-placeholder">
                            <div className="placeholder-icon">🖼️</div>
                            <p>Upload gambar background</p>
                        </div>
                    )}

                    {stickers.map(sticker => (
                        <div
                            key={sticker.id}
                            id={`sticker-${sticker.id}`}
                            onMouseDown={(e) => handleMouseDown(e, sticker.id, 'move')}
                            onTouchStart={(e) => handleTouchStart(e, sticker.id, 'move')}
                            onClick={(e) => handleStickerClick(e, sticker.id)}
                            onDoubleClick={(e) => handleStickerDoubleClick(e, sticker.id)}
                            style={{
                                left: `${sticker.x}%`,
                                top: `${sticker.y}%`,
                                color: sticker.color,
                                fontSize: `${sticker.fontSize}px`,
                                transform: `translate(-50%, -50%) rotate(${sticker.rotation || 0}deg)`,
                                cursor: isDragging ? 'grabbing' : 'grab',
                                border: selectedStickerId === sticker.id ? '1px dashed #3b82f6' : 'none'
                            }}
                            className="sticker"
                        >
                            {sticker.text}

                            {/* Handles (Only when selected) */}
                            {selectedStickerId === sticker.id && (
                                <>
                                    <div
                                        className="rotate-handle"
                                        onMouseDown={(e) => handleMouseDown(e, sticker.id, 'rotate')}
                                        onTouchStart={(e) => handleTouchStart(e, sticker.id, 'rotate')}
                                    >
                                        ↻
                                    </div>
                                    <div
                                        className="resize-handle"
                                        onMouseDown={(e) => handleMouseDown(e, sticker.id, 'resize')}
                                        onTouchStart={(e) => handleTouchStart(e, sticker.id, 'resize')}
                                    >
                                        ⤡
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    className="download-button"
                    onClick={handleEvaluate}
                    disabled={!background || isEvaluating}
                >
                    {isEvaluating ? (
                        <span>AI Sedang Menilai...</span>
                    ) : (
                        <>
                            <Wand2 size={20} />
                            <span>Dapatkan Review AI Coach</span>
                        </>
                    )}
                </button>
            </div >

            {/* Evaluation Modal */}
            {
                showEvaluation && evaluationResult && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Penilaian Coach AI</h3>
                                <button className="close-btn" onClick={() => setShowEvaluation(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grade-display">
                                <div className="grade-circle">{evaluationResult.grade}</div>
                                <p className="font-bold text-gray-700">Gred Design Anda</p>
                            </div>

                            <div className="feedback-section">
                                <span className="feedback-label">Komen Coach:</span>
                                <p className="feedback-text">{evaluationResult.feedback}</p>
                            </div>

                            <div className="feedback-section">
                                <span className="feedback-label">💡 Tip Pro:</span>
                                <p className="feedback-text">{evaluationResult.tips}</p>
                            </div>

                            <button className="download-button" onClick={handleDownload}>
                                <Download size={20} />
                                <span>Download Sekarang</span>
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Day6_StoryCanvas;
