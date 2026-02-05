import React from 'react';

/**
 * @file TemplateSidebar.jsx
 * @description A sidebar component ("Bubble Box") that displays saved prompt templates.
 * Allows users to load or delete saved prompts. Inherits glassmorphism style.
 * 
 * @module Components/TemplateSidebar
 * @author Feng
 * @date 2026-02-04
 */

/**
 * TemplateSidebar Component.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.templates - List of template objects to display.
 * @param {Function} props.onLoad - Callback to load a selected template.
 * @param {Function} props.onDelete - Callback to delete a template.
 * @param {boolean} props.isOpen - Controls the visibility of the sidebar.
 * @param {Function} props.onClose - Callback to close the sidebar.
 * 
 * @returns {JSX.Element} The rendered Sidebar component.
 */
const TemplateSidebar = ({ templates, onLoad, onDelete, isOpen, onClose }) => {
    return (
        <>
            {/* Backdrop Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(5px)', zIndex: 900
                    }}
                />
            )}

            {/* Sidebar Panel */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                bottom: '20px',
                width: '350px',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '30px',
                transform: isOpen ? 'translateX(0)' : 'translateX(150%)',
                // Spring animation for smooth entry/exit
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                pointerEvents: 'auto' // Fix: Allow interactions inside sidebar even if parent disallows
            }}>
                {/* Sidebar Header */}
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, #a29bfe, #6C5CE7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📂 泡泡盒子</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.3)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '30px', height: '30px',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Templates List */}
                <div style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
                    {templates.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '50px', color: '#b2bec3' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📦</div>
                            暂无收藏
                        </div>
                    ) : (
                        templates.map((tpl) => (
                            <div
                                key={tpl.id}
                                onClick={() => onLoad(tpl)}
                                style={{
                                    background: 'white',
                                    padding: '15px',
                                    borderRadius: '20px',
                                    marginBottom: '10px',
                                    cursor: 'pointer',
                                    boxShadow: '0 5px 10px rgba(0,0,0,0.03)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 5px 10px rgba(0,0,0,0.03)';
                                }}
                            >
                                <div style={{ fontWeight: 'bold', color: '#2D3436', marginBottom: '5px' }}>{tpl.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#b2bec3', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{new Date(tpl.date).toLocaleDateString()}</span>
                                    <span
                                        onClick={(e) => { e.stopPropagation(); onDelete(tpl.id); }}
                                        style={{ color: '#ff7675', cursor: 'pointer' }}
                                    >
                                        删除
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default TemplateSidebar;
