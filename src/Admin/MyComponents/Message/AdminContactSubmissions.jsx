import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import AdminSidebar from '../Sidebar/Sidebar';
import AdminNavbar from '../AdminNavebar/Adminnavbar';
import supabase from '../../../lib/supabaseClient';
import './ContactSubmissions.css';

const AVATAR_PALETTE = [
    { bg: '#EFF6FF', text: '#2563EB' },
    { bg: '#ECFDF3', text: '#16A34A' },
    { bg: '#FFF7ED', text: '#C2410C' },
    { bg: '#FAF5FF', text: '#9333EA' },
    { bg: '#FDF2F8', text: '#DB2777' },
    { bg: '#F0FDFA', text: '#0D9488' },
];

const MESSAGE_PREVIEW_LENGTH = 90;
const NEW_WINDOW_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

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

const AdminContactSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [expandedIds, setExpandedIds] = useState(() => new Set());
    const [deletingId, setDeletingId] = useState(null);
    const [notice, setNotice] = useState(null); // { type, text }

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
        const timer = setTimeout(() => setNotice(null), 5000);
        return () => clearTimeout(timer);
    }, [notice]);

    const stats = useMemo(() => {
        const now = Date.now();
        const newThisWeek = submissions.filter(
            (s) => now - new Date(s.created_at).getTime() < WEEK_MS
        ).length;
        const uniqueSenders = new Set(
            submissions.map((s) => (s.email || '').toLowerCase()).filter(Boolean)
        ).size;
        return {
            total: submissions.length,
            newThisWeek,
            uniqueSenders,
        };
    }, [submissions]);

    const visibleSubmissions = useMemo(() => {
        const query = search.trim().toLowerCase();
        let list = submissions;
        if (query) {
            list = list.filter((s) => {
                const haystack = `${s.name || ''} ${s.email || ''} ${s.phone || ''} ${s.message || ''}`.toLowerCase();
                return haystack.includes(query);
            });
        }
        const sorted = [...list].sort((a, b) => {
            const diff = new Date(a.created_at) - new Date(b.created_at);
            return sortOrder === 'newest' ? -diff : diff;
        });
        return sorted;
    }, [submissions, search, sortOrder]);

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
        if (visibleSubmissions.length === 0) return;
        const header = ['Name', 'Email', 'Phone', 'Message', 'Received'];
        const rows = visibleSubmissions.map((s) => [
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
        <>
            <AdminNavbar />
            <Container fluid className="p-0">
                <Row className="m-0">
                    <Col md={3} className="sidebar-column">
                        <AdminSidebar />
                    </Col>
                    <Col md={9} className="main-content">
                        <Container className="contact-messages-page">
                            <div className="cm-header">
                                <div>
                                    <h1 className="cm-title">Contact Messages</h1>
                                    <p className="cm-subtitle">
                                        View and follow up on messages submitted through the contact form.
                                    </p>
                                </div>
                                <Button
                                    className="cm-export-btn"
                                    onClick={handleExportCSV}
                                    disabled={visibleSubmissions.length === 0}
                                >
                                    <span aria-hidden="true">&#8595;</span> Export CSV
                                </Button>
                            </div>

                            {error && (
                                <div className="cm-error-banner">
                                    <span className="cm-error-icon" aria-hidden="true">&#9888;</span>
                                    <span>{error}</span>
                                    <Button className="cm-retry-btn" onClick={fetchSubmissions}>
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {notice && (
                                <div className={`cm-notice cm-notice--${notice.type}`}>
                                    {notice.text}
                                </div>
                            )}

                            <Row className="g-3 cm-stats">
                                <Col sm={6} lg={4}>
                                    <div className="cm-stat-card">
                                        <span className="cm-stat-icon cm-stat-icon--blue" aria-hidden="true">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <div>
                                            <div className="cm-stat-label">Total Messages</div>
                                            <div className="cm-stat-value">{stats.total}</div>
                                            <div className="cm-stat-caption">All time</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6} lg={4}>
                                    <div className="cm-stat-card">
                                        <span className="cm-stat-icon cm-stat-icon--green" aria-hidden="true">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M7 14l4-4 3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <div>
                                            <div className="cm-stat-label">New This Week</div>
                                            <div className="cm-stat-value">{stats.newThisWeek}</div>
                                            <div className="cm-stat-caption">Last 7 days</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col sm={6} lg={4}>
                                    <div className="cm-stat-card">
                                        <span className="cm-stat-icon cm-stat-icon--orange" aria-hidden="true">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <div>
                                            <div className="cm-stat-label">Unique Senders</div>
                                            <div className="cm-stat-value">{stats.uniqueSenders}</div>
                                            <div className="cm-stat-caption">Distinct emails</div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <div className="cm-card">
                                <div className="cm-toolbar">
                                    <div className="cm-search-wrap">
                                        <svg className="cm-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by name, email or message..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="cm-search-input"
                                        />
                                    </div>
                                    <Form.Select
                                        className="cm-sort-select"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                    </Form.Select>
                                </div>

                                {loading ? (
                                    <div className="cm-skeleton-wrap">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div className="cm-skeleton-row" key={i}>
                                                <span className="cm-skeleton cm-skeleton--avatar" />
                                                <span className="cm-skeleton cm-skeleton--line" style={{ width: '18%' }} />
                                                <span className="cm-skeleton cm-skeleton--line" style={{ width: '22%' }} />
                                                <span className="cm-skeleton cm-skeleton--line" style={{ width: '30%' }} />
                                                <span className="cm-skeleton cm-skeleton--line" style={{ width: '10%' }} />
                                            </div>
                                        ))}
                                    </div>
                                ) : visibleSubmissions.length === 0 ? (
                                    <div className="cm-empty">
                                        <div className="cm-empty-icon" aria-hidden="true">&#9993;</div>
                                        <p className="cm-empty-title">
                                            {submissions.length === 0 ? 'No messages yet' : 'No messages match your search'}
                                        </p>
                                        <p className="cm-empty-subtitle">
                                            {submissions.length === 0
                                                ? 'Messages submitted through the contact form will appear here.'
                                                : 'Try a different name, email, or keyword.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="cm-table-wrap">
                                        <Table responsive className="cm-table">
                                            <thead>
                                                <tr>
                                                    <th>Sender</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>Message</th>
                                                    <th>Received</th>
                                                    <th className="cm-actions-col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visibleSubmissions.map((submission) => {
                                                    const palette = AVATAR_PALETTE[hashToIndex(submission.email || submission.id, AVATAR_PALETTE.length)];
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
                                                                <div className="cm-sender-cell">
                                                                    <span
                                                                        className="cm-avatar"
                                                                        style={{ background: palette.bg, color: palette.text }}
                                                                    >
                                                                        {initialsFor(submission.name)}
                                                                    </span>
                                                                    <div>
                                                                        <div className="cm-sender-name">
                                                                            {submission.name || 'Unnamed Sender'}
                                                                            {isNew && <span className="cm-new-pill">New</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="cm-muted-cell">{submission.email || '—'}</td>
                                                            <td className="cm-muted-cell">{submission.phone || '—'}</td>
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
                                                                <div className="cm-date-cell">
                                                                    <div>{formatDate(submission.created_at)}</div>
                                                                    <div className="cm-date-relative">{formatRelative(submission.created_at)}</div>
                                                                </div>
                                                            </td>
                                                            <td className="cm-actions-col">
                                                                <button
                                                                    type="button"
                                                                    className="cm-icon-btn cm-icon-btn--danger"
                                                                    aria-label={`Delete message from ${submission.name || 'sender'}`}
                                                                    onClick={() => handleDelete(submission)}
                                                                    disabled={deletingId === submission.id}
                                                                >
                                                                    {deletingId === submission.id ? (
                                                                        <span className="cm-spinner" aria-hidden="true" />
                                                                    ) : (
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminContactSubmissions;
