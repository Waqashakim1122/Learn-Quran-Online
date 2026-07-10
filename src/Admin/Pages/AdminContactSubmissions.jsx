import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../Sidebar/Sidebar';
import AdminNavbar from '../AdminNavebar/Adminnavbar';
import supabase from '../../../lib/supabaseClient';
import './ContactSubmissions.css';

/* ============================================================
   Constants
============================================================ */

const MESSAGE_PREVIEW_LENGTH = 100;
const NEW_WINDOW_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const PAGE_SIZE = 8;
const NOTICE_AUTO_DISMISS_MS = 5000;

const AVATAR_COLORS = ['blue', 'green', 'orange', 'purple', 'gold'];

const hashToIndex = (str, mod) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % mod;
};

const initialsFor = (name) => {
    if (!name || !name.trim()) return '?';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
};

const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatRelative = (iso) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (diffMs < minute) return 'Just now';
    if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
    if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
    if (diffMs < week) return `${Math.floor(diffMs / day)}d ago`;
    return `${Math.floor(diffMs / week)}w ago`;
};

// Windowed pagination: 1 ... c-1 c c+1 ... total
const getPageList = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const withEllipsis = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) withEllipsis.push('...');
        withEllipsis.push(p);
    });
    return withEllipsis;
};

/* ================= ICONS (same visual language as the other pages) ================= */

const IconMail = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 6 10-6" />
    </svg>
);

const IconTrendUp = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconUsers = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const IconSearch = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
);

const IconDownload = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v12" strokeLinecap="round" />
        <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 19h16" strokeLinecap="round" />
    </svg>
);

const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconSpinner = () => (
    <svg className="cm-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M21 12a9 9 0 11-9-9" strokeLinecap="round" />
    </svg>
);

const IconAlertCircle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const IconCheckCircle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="16 9 11 14 8 11" />
    </svg>
);

const IconInbox = () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </svg>
);

const IconChevronLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const IconChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

/* ================= Skeletons ================= */

const StatSkeleton = () => (
    <div className="cm-stat-card">
        <div className="cm-skel cm-skel-icon" />
        <div style={{ flex: 1 }}>
            <div className="cm-skel" style={{ width: '100px', height: '12px', marginBottom: '10px' }} />
            <div className="cm-skel" style={{ width: '50px', height: '26px' }} />
        </div>
    </div>
);

const RowSkeleton = () => (
    <tr aria-hidden="true">
        <td>
            <div className="cm-skeleton-sender">
                <div className="cm-skel cm-skel-avatar" />
                <div className="cm-skel" style={{ width: '110px', height: '13px' }} />
            </div>
        </td>
        <td><div className="cm-skel" style={{ width: '140px' }} /></td>
        <td><div className="cm-skel" style={{ width: '90px' }} /></td>
        <td><div className="cm-skel" style={{ width: '220px' }} /></td>
        <td><div className="cm-skel" style={{ width: '70px' }} /></td>
        <td><div className="cm-skel" style={{ width: '32px', height: '32px', borderRadius: '6px' }} /></td>
    </tr>
);

/* ============================================================
   Component
============================================================ */

const AdminContactSubmissions = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const toggleSidebar = () => setShowSidebar((prev) => !prev);

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [expandedIds, setExpandedIds] = useState(() => new Set());
    const [deletingId, setDeletingId] = useState(null);
    const [notice, setNotice] = useState(null); // { type: 'success' | 'danger', text }
    const [page, setPage] = useState(1);

    const fetchSubmissions = async () => {
        setLoading(true);
        setError('');
        try {
            const { data, error: fetchError } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });
            if (fetchError) throw fetchError;
            setSubmissions(data || []);
        } catch (err) {
            setError('Unable to load messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    useEffect(() => {
        if (!notice) return;
        const timer = setTimeout(() => setNotice(null), NOTICE_AUTO_DISMISS_MS);
        return () => clearTimeout(timer);
    }, [notice]);

    useEffect(() => {
        setPage(1);
    }, [search, sortOrder]);

    const stats = useMemo(() => {
        const now = Date.now();
        const newThisWeek = submissions.filter(
            (s) => now - new Date(s.created_at).getTime() < WEEK_MS
        ).length;
        const uniqueSenders = new Set(
            submissions.map((s) => (s.email || '').toLowerCase()).filter(Boolean)
        ).size;
        return { total: submissions.length, newThisWeek, uniqueSenders };
    }, [submissions]);

    const filteredSorted = useMemo(() => {
        const query = search.trim().toLowerCase();
        let list = submissions;
        if (query) {
            list = list.filter((s) => {
                const haystack = `${s.name || ''} ${s.email || ''} ${s.phone || ''} ${s.message || ''}`.toLowerCase();
                return haystack.includes(query);
            });
        }
        return [...list].sort((a, b) => {
            const diff = new Date(a.created_at) - new Date(b.created_at);
            return sortOrder === 'newest' ? -diff : diff;
        });
    }, [submissions, search, sortOrder]);

    const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filteredSorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const toggleExpanded = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const handleDelete = async (submission) => {
        const confirmed = window.confirm(
            `Delete the message from ${submission.name || 'this sender'}? This can't be undone.`
        );
        if (!confirmed) return;

        setDeletingId(submission.id);
        try {
            const { error: deleteError } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', submission.id);
            if (deleteError) throw deleteError;
            setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
            setNotice({ type: 'success', text: 'Message deleted.' });
        } catch (err) {
            setNotice({ type: 'danger', text: 'Failed to delete message. Please try again.' });
        } finally {
            setDeletingId(null);
        }
    };

    const handleExportCSV = () => {
        if (filteredSorted.length === 0) return;
        const header = ['Name', 'Email', 'Phone', 'Message', 'Received'];
        const rows = filteredSorted.map((s) => [
            s.name || '',
            s.email || '',
            s.phone || '',
            (s.message || '').replace(/"/g, '""'),
            formatDate(s.created_at),
        ]);
        const csv = [header, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'contact-messages.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="cm-page">

            <AdminNavbar />

            <div className="cm-body">

                <AdminSidebar
                    showSidebar={showSidebar}
                    toggleSidebar={toggleSidebar}
                />

                <main className="cm-main">

                    <button
                        type="button"
                        className="cm-mobile-menu"
                        onClick={toggleSidebar}
                        aria-label="Toggle navigation menu"
                    >
                        ☰ Menu
                    </button>

                    {/* ================= HEADER ================= */}

                    <div className="cm-header">
                        <div>
                            <h1>Contact Messages</h1>
                            <p>View and follow up on messages submitted through the contact form.</p>
                        </div>

                        <button
                            type="button"
                            className="cm-export-btn"
                            onClick={handleExportCSV}
                            disabled={filteredSorted.length === 0}
                        >
                            <IconDownload />
                            Export CSV
                        </button>
                    </div>

                    {/* ================= ALERTS ================= */}

                    {error && (
                        <div className="cm-alert danger" role="alert">
                            <IconAlertCircle />
                            <span>{error}</span>
                            <button type="button" className="cm-retry-btn" onClick={fetchSubmissions}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {notice && (
                        <div className={`cm-alert ${notice.type}`} role="status">
                            {notice.type === 'success' ? <IconCheckCircle /> : <IconAlertCircle />}
                            <span>{notice.text}</span>
                        </div>
                    )}

                    {/* ================= STATS ================= */}

                    <div className="cm-stats">
                        {loading ? (
                            <>
                                <StatSkeleton />
                                <StatSkeleton />
                                <StatSkeleton />
                            </>
                        ) : (
                            <>
                                <div className="cm-stat-card">
                                    <div className="cm-stat-icon blue"><IconMail /></div>
                                    <div>
                                        <span>Total Messages</span>
                                        <h2>{stats.total}</h2>
                                    </div>
                                </div>

                                <div className="cm-stat-card">
                                    <div className="cm-stat-icon green"><IconTrendUp /></div>
                                    <div>
                                        <span>New This Week</span>
                                        <h2>{stats.newThisWeek}</h2>
                                    </div>
                                </div>

                                <div className="cm-stat-card">
                                    <div className="cm-stat-icon orange"><IconUsers /></div>
                                    <div>
                                        <span>Unique Senders</span>
                                        <h2>{stats.uniqueSenders}</h2>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ================= TOOLBAR ================= */}

                    <div className="cm-toolbar">
                        <div className="cm-search-wrap">
                            <IconSearch />
                            <input
                                type="text"
                                className="cm-search"
                                placeholder="Search by name, email or message..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            aria-label="Sort messages"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>

                    {/* ================= TABLE ================= */}

                    <div className="cm-table-card">

                        {!loading && filteredSorted.length === 0 ? (
                            <div className="cm-empty">
                                <div className="cm-empty-icon"><IconInbox /></div>
                                <h3>{submissions.length === 0 ? 'No messages yet' : 'No messages match your search'}</h3>
                                <p>
                                    {submissions.length === 0
                                        ? 'Messages submitted through the contact form will appear here.'
                                        : 'Try a different name, email, or keyword.'}
                                </p>
                            </div>
                        ) : (
                            <div className="cm-table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Sender</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Message</th>
                                            <th>Received</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <>
                                                <RowSkeleton />
                                                <RowSkeleton />
                                                <RowSkeleton />
                                                <RowSkeleton />
                                            </>
                                        ) : pageItems.map((submission) => {
                                            const colorClass = AVATAR_COLORS[hashToIndex(submission.email || String(submission.id), AVATAR_COLORS.length)];
                                            const isNew = Date.now() - new Date(submission.created_at).getTime() < NEW_WINDOW_MS;
                                            const isExpanded = expandedIds.has(submission.id);
                                            const message = submission.message || '';
                                            const isLong = message.length > MESSAGE_PREVIEW_LENGTH;
                                            const displayMessage = isExpanded || !isLong
                                                ? message
                                                : `${message.slice(0, MESSAGE_PREVIEW_LENGTH)}...`;

                                            return (
                                                <tr key={submission.id}>
                                                    <td>
                                                        <div className="cm-sender">
                                                            <span className={`cm-avatar ${colorClass}`}>
                                                                {initialsFor(submission.name)}
                                                            </span>
                                                            <div>
                                                                <h4>
                                                                    {submission.name || 'Unnamed Sender'}
                                                                    {isNew && <span className="cm-new-pill">New</span>}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="cm-muted">{submission.email || '—'}</td>
                                                    <td className="cm-muted">{submission.phone || '—'}</td>
                                                    <td className="cm-message-cell">
                                                        {displayMessage}
                                                        {isLong && (
                                                            <button
                                                                type="button"
                                                                className="cm-readmore"
                                                                onClick={() => toggleExpanded(submission.id)}
                                                            >
                                                                {isExpanded ? 'Show less' : 'Read More'}
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="cm-date">
                                                            <h5>{formatDate(submission.created_at)}</h5>
                                                            <span>{formatRelative(submission.created_at)}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="cm-actions">
                                                            <button
                                                                type="button"
                                                                className="danger"
                                                                aria-label={`Delete message from ${submission.name || 'sender'}`}
                                                                onClick={() => handleDelete(submission)}
                                                                disabled={deletingId === submission.id}
                                                            >
                                                                {deletingId === submission.id ? <IconSpinner /> : <IconTrash />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!loading && filteredSorted.length > PAGE_SIZE && (
                            <div className="cm-pagination">
                                <div className="cm-pagination-info">
                                    Showing <strong>{(currentPage - 1) * PAGE_SIZE + 1}</strong>
                                    {' - '}
                                    <strong>{Math.min(currentPage * PAGE_SIZE, filteredSorted.length)}</strong>
                                    {' of '}
                                    <strong>{filteredSorted.length}</strong>
                                </div>
                                <div className="cm-pagination-controls">
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        aria-label="Previous page"
                                    >
                                        <IconChevronLeft />
                                    </button>
                                    {getPageList(currentPage, totalPages).map((p, i) => (
                                        p === '...' ? (
                                            <span className="cm-pagination-ellipsis" key={`e-${i}`}>&hellip;</span>
                                        ) : (
                                            <button
                                                type="button"
                                                key={p}
                                                className={p === currentPage ? 'active' : ''}
                                                onClick={() => setPage(p)}
                                            >
                                                {p}
                                            </button>
                                        )
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        aria-label="Next page"
                                    >
                                        <IconChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                </main>

            </div>

        </div>
    );
};

export default AdminContactSubmissions;
