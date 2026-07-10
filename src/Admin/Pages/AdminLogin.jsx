import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AdminLogin.css';

/* ================= ICONS ================= */

const IconMail = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 6 10-6" />
    </svg>
);

const IconLock = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

const IconEye = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconEyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a20.3 20.3 0 015.06-6.06M9.9 4.24A10.4 10.4 0 0112 4c7 0 11 8 11 8a20.5 20.5 0 01-3.22 4.44M14.12 14.12a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const IconAlertCircle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const IconSpinner = () => (
    <svg className="al-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 12a9 9 0 11-9-9" strokeLinecap="round" />
    </svg>
);

const IconArrowLeft = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password) {
            setError('Please enter your email and password.');
            return;
        }

        if (!EMAIL_PATTERN.test(trimmedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await login(trimmedEmail, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="al-page">

            {/* ================= BRAND PANEL ================= */}

            <div className="al-brand-panel">
                <div className="al-brand-pattern" aria-hidden="true" />
                <div className="al-brand-content">
                    <div className="al-brand-logo">
                        Learning Qur<span>a</span>n
                        <small>ONLINE</small>
                    </div>
                    <h2>Admin Panel</h2>
                    <p>Manage courses, enrollments, and student messages from one place.</p>
                </div>
            </div>

            {/* ================= FORM PANEL ================= */}

            <div className="al-form-panel">
                <div className="al-form-card">

                    <span className="al-badge">ADMIN ACCESS</span>
                    <h1>Welcome back</h1>
                    <p className="al-subtitle">Sign in to access the admin dashboard.</p>

                    {error && (
                        <div className="al-alert" role="alert">
                            <IconAlertCircle />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="al-field">
                            <label htmlFor="adminEmail">Email address</label>
                            <div className="al-input-wrap">
                                <span className="al-input-icon"><IconMail /></span>
                                <input
                                    id="adminEmail"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="al-field">
                            <label htmlFor="adminPassword">Password</label>
                            <div className="al-input-wrap">
                                <span className="al-input-icon"><IconLock /></span>
                                <input
                                    id="adminPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="al-eye-btn"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <IconEyeOff /> : <IconEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="al-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <IconSpinner />
                                    Signing in&hellip;
                                </>
                            ) : 'Sign In'}
                        </button>

                    </form>

                    <Link to="/" className="al-back-link">
                        <IconArrowLeft />
                        Back to Home
                    </Link>

                </div>
            </div>

        </div>
    );
};

export default AdminLogin;
