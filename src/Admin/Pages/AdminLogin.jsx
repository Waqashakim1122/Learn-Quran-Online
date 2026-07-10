import React, { useState, useEffect, useRef } from 'react';
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

const IconShield = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

/* =========================================================
   Client-side lockout after repeated failed attempts.
   This is a UX deterrent, NOT a substitute for real
   brute-force protection — that must also be enforced
   server-side (e.g. Supabase Auth rate limiting / a
   captcha on the login RPC). It stops casual guessing
   and accidental hammering, not a determined attacker
   with dev tools open.
========================================================= */
const LOCKOUT_KEY = 'adminLoginLockout';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60 * 1000; // 1 minute

const readLockoutState = () => {
    try {
        const raw = localStorage.getItem(LOCKOUT_KEY);
        if (!raw) return { attempts: 0, lockUntil: 0 };
        const parsed = JSON.parse(raw);
        return {
            attempts: parsed.attempts || 0,
            lockUntil: parsed.lockUntil || 0,
        };
    } catch {
        return { attempts: 0, lockUntil: 0 };
    }
};

const writeLockoutState = (state) => {
    try {
        localStorage.setItem(LOCKOUT_KEY, JSON.stringify(state));
    } catch {
        /* localStorage unavailable — fail open silently, not a hard requirement */
    }
};

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [lockUntil, setLockUntil] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const navigate = useNavigate();
    const { login } = useAuth();
    const emailRef = useRef(null);

    // Restore any active lock on mount (survives refresh)
    useEffect(() => {
        const { lockUntil: storedLockUntil } = readLockoutState();
        if (storedLockUntil > Date.now()) {
            setLockUntil(storedLockUntil);
        }
        emailRef.current?.focus();
    }, []);

    // Countdown ticker while locked
    useEffect(() => {
        if (!lockUntil) {
            setSecondsLeft(0);
            return;
        }
        const tick = () => {
            const remaining = Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));
            setSecondsLeft(remaining);
            if (remaining <= 0) {
                setLockUntil(0);
                writeLockoutState({ attempts: 0, lockUntil: 0 });
            }
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [lockUntil]);

    const isLocked = lockUntil > Date.now();

    const registerFailedAttempt = () => {
        const current = readLockoutState();
        const attempts = current.attempts + 1;

        if (attempts >= MAX_ATTEMPTS) {
            const until = Date.now() + LOCK_DURATION_MS;
            writeLockoutState({ attempts: 0, lockUntil: until });
            setLockUntil(until);
        } else {
            writeLockoutState({ attempts, lockUntil: 0 });
        }
    };

    const clearLockoutState = () => {
        writeLockoutState({ attempts: 0, lockUntil: 0 });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (isLocked) {
            return;
        }

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
            clearLockoutState();
            navigate('/dashboard');
        } catch (err) {
            registerFailedAttempt();
            // Deliberately generic — never confirm whether the email exists.
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="al-page">

            {/* ================= BRAND PANEL =================
                Just the logo over the photo now. No marketing
                copy here — an admin arriving at this URL already
                knows what the portal is for; the copy was only
                repeating itself. */}

            <div className="al-brand-panel">
                <div className="al-brand-scrim" aria-hidden="true" />
                <div className="al-brand-content">
                    <div className="al-brand-logo">
                        <div className="al-brand-logo-word">Learning Qur<span>a</span>n</div>
                        <small>ONLINE</small>
                    </div>

                    <div className="al-brand-verse">
                        <p className="al-brand-verse-ar">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</p>
                        <p className="al-brand-verse-en">&ldquo;Read in the name of your Lord who created&rdquo; &mdash; Surah Al-Alaq 96:1</p>
                    </div>
                </div>
            </div>

            {/* ================= FORM PANEL ================= */}

            <div className="al-form-panel">
                <div className="al-form-card">

                    <span className="al-badge">ADMIN ACCESS</span>
                    <h1>Welcome back</h1>
                    <p className="al-subtitle">Sign in to access the admin dashboard.</p>

                    {error && !isLocked && (
                        <div className="al-alert" role="alert" aria-live="assertive">
                            <IconAlertCircle />
                            <span>{error}</span>
                        </div>
                    )}

                    {isLocked && (
                        <div className="al-alert al-alert-warning" role="alert" aria-live="assertive">
                            <IconAlertCircle />
                            <span>
                                Too many failed attempts. Try again in {secondsLeft}s.
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate aria-disabled={isLocked}>

                        <div className="al-field">
                            <label htmlFor="adminEmail">Email address<span className="al-required" aria-hidden="true">*</span></label>
                            <div className="al-input-wrap">
                                <span className="al-input-icon"><IconMail /></span>
                                <input
                                    ref={emailRef}
                                    id="adminEmail"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="username"
                                    maxLength={254}
                                    disabled={loading || isLocked}
                                    required
                                />
                            </div>
                        </div>

                        <div className="al-field">
                            <label htmlFor="adminPassword">Password<span className="al-required" aria-hidden="true">*</span></label>
                            <div className="al-input-wrap">
                                <span className="al-input-icon"><IconLock /></span>
                                <input
                                    id="adminPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    maxLength={128}
                                    disabled={loading || isLocked}
                                    required
                                />
                                <button
                                    type="button"
                                    className="al-eye-btn"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    disabled={loading || isLocked}
                                >
                                    {showPassword ? <IconEyeOff /> : <IconEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="al-submit-btn"
                            disabled={loading || isLocked}
                        >
                            {loading ? (
                                <>
                                    <IconSpinner />
                                    Signing in&hellip;
                                </>
                            ) : isLocked ? (
                                `Locked (${secondsLeft}s)`
                            ) : 'Sign In'}
                        </button>

                    </form>

                    <div className="al-security-note">
                        <IconShield />
                        <span>This portal is restricted to authorized administrators. Access attempts are logged.</span>
                    </div>

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
