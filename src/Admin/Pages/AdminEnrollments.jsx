import React, { useState, useEffect, useMemo, useRef } from 'react';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';
import supabase from '../../lib/supabaseClient';
import './AdminEnrollments.css';

const PAGE_SIZE = 10;

const COURSE_STYLES = {
    'Quran Hifz': 'green',
    'Quran Nazra': 'gold',
    'Quran Reading': 'gold',
    'Tajweed Course': 'green',
    'Noorani Qaida': 'brown',
};

const STATUS_OPTIONS = ['Active', 'Pending', 'Trial', 'Cancelled'];

const STATUS_STYLES = {
    Active: 'success',
    Pending: 'warning',
    Trial: 'info',
    Cancelled: 'danger',
};

const getCourseClass = (course) => {
    const key = COURSE_STYLES[course];
    return key ? `enr-badge--${key}` : 'enr-badge--default';
};

const getStatusClass = (status) => {
    const key = STATUS_STYLES[status];
    return key ? `enr-status--${key}` : 'enr-status--warning';
};

const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [courseFilter, setCourseFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSidebar, setShowSidebar] = useState(false);

    const [openMenuId, setOpenMenuId] = useState(null);
    const [statusSubmenuId, setStatusSubmenuId] = useState(null);
    const [viewingEnrollment, setViewingEnrollment] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const menuRef = useRef(null);

    const toggleSidebar = () => setShowSidebar((prev) => !prev);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    // close the actions dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
                setStatusSubmenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('enrollments')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            const formatted = (data || []).map((item) => ({
                ...item,
                status: item.status || 'Pending',
            }));
            setEnrollments(formatted);
        } catch (error) {
            setMessage('Failed to fetch enrollments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const courseOptions = useMemo(() => {
        const unique = new Set(enrollments.map((e) => e.course_name).filter(Boolean));
        return Array.from(unique);
    }, [enrollments]);

    const stats = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);

        return {
            total: enrollments.length,
            thisWeek: enrollments.filter((e) => new Date(e.created_at) >= weekAgo).length,
            active: enrollments.filter((e) => e.status === 'Active').length,
            pending: enrollments.filter((e) => e.status === 'Pending').length,
        };
    }, [enrollments]);

    const filteredEnrollments = useMemo(() => {
        let list = [...enrollments];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((e) =>
                [e.student_name, e.email, e.phone, e.course_name]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(q))
            );
        }

        if (courseFilter !== 'all') {
            list = list.filter((e) => e.course_name === courseFilter);
        }

        if (statusFilter !== 'all') {
            list = list.filter((e) => e.status === statusFilter);
        }

        list.sort((a, b) =>
            sortBy === 'oldest'
                ? new Date(a.created_at) - new Date(b.created_at)
                : new Date(b.created_at) - new Date(a.created_at)
        );

        return list;
    }, [enrollments, search, courseFilter, statusFilter, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredEnrollments.length / PAGE_SIZE));

    const paginatedEnrollments = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredEnrollments.slice(start, start + PAGE_SIZE);
    }, [filteredEnrollments, currentPage]);

    // keep current page in range whenever filters change the result count
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    const hasActiveFilters =
        search.trim() !== '' || courseFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'newest';

    const resetFilters = () => {
        setSearch('');
        setCourseFilter('all');
        setStatusFilter('all');
        setSortBy('newest');
        setCurrentPage(1);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase();
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const timeAgo = (dateStr) => {
        const diffMs = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (days <= 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;
        const weeks = Math.floor(days / 7);
        return `${weeks}w ago`;
    };

    const handleExport = () => {
        const rows = filteredEnrollments.map((e) => ({
            Student: e.student_name || 'Unnamed student',
            Email: e.email || '',
            Phone: e.phone || '',
            Course: e.course_name || '',
            Status: e.status,
            Enrolled: formatDate(e.created_at),
        }));
        const headers = Object.keys(rows[0] || { Student: '', Email: '', Phone: '', Course: '', Status: '', Enrolled: '' });
        const csv = [
            headers.join(','),
            ...rows.map((row) => headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `enrollments-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleStatusChange = async (id, newStatus) => {
        setBusyId(id);
        try {
            const { error } = await supabase
                .from('enrollments')
                .update({ status: newStatus })
                .eq('id', id);
            if (error) throw error;
            setEnrollments((prev) =>
                prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
            );
        } catch (error) {
            setMessage('Failed to update status. Please try again.');
        } finally {
            setBusyId(null);
            setOpenMenuId(null);
            setStatusSubmenuId(null);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Delete this enrollment? This cannot be undone.');
        if (!confirmed) return;

        setBusyId(id);
        try {
            const { error } = await supabase.from('enrollments').delete().eq('id', id);
            if (error) throw error;
            setEnrollments((prev) => prev.filter((e) => e.id !== id));
        } catch (error) {
            setMessage('Failed to delete enrollment. Please try again.');
        } finally {
            setBusyId(null);
            setOpenMenuId(null);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const windowSize = 1;

        for (let i = 1; i <= totalPages; i++) {
            const isEdge = i === 1 || i === totalPages;
            const isNearCurrent = Math.abs(i - currentPage) <= windowSize;

            if (isEdge || isNearCurrent) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return pages.map((p, idx) =>
            p === '...' ? (
                <span key={`ellipsis-${idx}`} className="enr-page-ellipsis">…</span>
            ) : (
                <button
                    key={p}
                    type="button"
                    className={`enr-page-btn ${p === currentPage ? 'enr-page-btn--active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                >
                    {p}
                </button>
            )
        );
    };

    return (
        <div className="enr-page">
            <AdminNavbar section="Admin Panel" title="Enrollments" />

            <div className="enr-body">
                <AdminSidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />

                <main className="enr-main">
                    <button type="button" className="enr-menu-btn" onClick={toggleSidebar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                        Menu
                    </button>

                    <div className="enr-header">
                        <div>
                            <span className="enr-eyebrow">Student Records</span>
                            <h1 className="enr-title">Enrollments</h1>
                            <p className="enr-subtitle">All trial and course enrollment requests, most recent first.</p>
                        </div>

                        <div className="enr-header-actions">
                            <button type="button" className="enr-btn enr-btn--outline" onClick={handleExport}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Export
                            </button>
                            <button type="button" className="enr-btn enr-btn--primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add Student
                            </button>
                        </div>
                    </div>

                    {/* Stats overview */}
                    <div className="enr-stats">
                        <div className="enr-stat-card">
                            <div className="enr-stat-icon enr-stat-icon--green">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div>
                                <div className="enr-stat-value">{stats.total}</div>
                                <div className="enr-stat-label">Total Enrollments</div>
                            </div>
                        </div>

                        <div className="enr-stat-card">
                            <div className="enr-stat-icon enr-stat-icon--gold">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 3v18h18" />
                                    <path d="m19 9-5 5-4-4-3 3" />
                                </svg>
                            </div>
                            <div>
                                <div className="enr-stat-value">{stats.thisWeek}</div>
                                <div className="enr-stat-label">New This Week</div>
                            </div>
                        </div>

                        <div className="enr-stat-card">
                            <div className="enr-stat-icon enr-stat-icon--success">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <div>
                                <div className="enr-stat-value">{stats.active}</div>
                                <div className="enr-stat-label">Active</div>
                            </div>
                        </div>

                        <div className="enr-stat-card">
                            <div className="enr-stat-icon enr-stat-icon--brown">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <div>
                                <div className="enr-stat-value">{stats.pending}</div>
                                <div className="enr-stat-label">Pending</div>
                            </div>
                        </div>
                    </div>

                    <div className="enr-card">
                        <div className="enr-toolbar">
                            <div className="enr-toolbar-left">
                                <h2 className="enr-card-title">
                                    All Enrollments
                                    <span className="enr-count-badge">{filteredEnrollments.length}</span>
                                </h2>
                            </div>

                            <div className="enr-toolbar-right">
                                <div className="enr-toolbar-filters">
                                    <div className="enr-select-wrap">
                                        <select
                                            value={courseFilter}
                                            onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                                            className="enr-select"
                                        >
                                            <option value="all">All Courses</option>
                                            {courseOptions.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="enr-select-chevron">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>

                                    <div className="enr-select-wrap">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                            className="enr-select"
                                        >
                                            <option value="all">All Statuses</option>
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="enr-select-chevron">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>

                                    <div className="enr-select-wrap">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="enr-select"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                        </select>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="enr-select-chevron">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>

                                    <button
                                        type="button"
                                        className="enr-reset-btn"
                                        onClick={resetFilters}
                                        disabled={!hasActiveFilters}
                                    >
                                        Reset Filters
                                    </button>
                                </div>

                                <div className="enr-search">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="7" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search name, email or course..."
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                    />
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className="enr-alert">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {message}
                            </div>
                        )}

                        {loading ? (
                            <div className="enr-state">
                                <div className="enr-spinner"></div>
                                <div className="enr-state-title">Loading enrollments…</div>
                            </div>
                        ) : filteredEnrollments.length === 0 ? (
                            <div className="enr-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                <div className="enr-state-title">
                                    {enrollments.length === 0 ? 'No enrollments yet' : 'No matches found'}
                                </div>
                                <div className="enr-state-sub">
                                    {enrollments.length === 0
                                        ? 'New sign-ups will appear here automatically.'
                                        : 'Try a different search term or filter.'}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="enr-table-wrap">
                                    <table className="enr-table">
                                        <thead>
                                            <tr>
                                                <th>Student</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Course</th>
                                                <th>Status</th>
                                                <th>Enrolled</th>
                                                <th className="enr-th-actions">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedEnrollments.map((enrollment) => (
                                                <tr key={enrollment.id}>
                                                    <td data-label="Student">
                                                        <div className="enr-student">
                                                            <div className="enr-avatar">{getInitials(enrollment.student_name)}</div>
                                                            <span className="enr-student-name">
                                                                {enrollment.student_name || 'Unnamed student'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="enr-muted" data-label="Email">{enrollment.email || '—'}</td>
                                                    <td className="enr-muted" data-label="Phone">{enrollment.phone || '—'}</td>
                                                    <td data-label="Course">
                                                        <span className={`enr-course-badge ${getCourseClass(enrollment.course_name)}`}>
                                                            {enrollment.course_name || 'Unspecified'}
                                                        </span>
                                                    </td>
                                                    <td data-label="Status">
                                                        <span className={`enr-status-badge ${getStatusClass(enrollment.status)}`}>
                                                            {enrollment.status}
                                                        </span>
                                                    </td>
                                                    <td className="enr-date-cell" data-label="Enrolled">
                                                        <span className="enr-muted">{formatDate(enrollment.created_at)}</span>
                                                        <span className="enr-time-ago">{timeAgo(enrollment.created_at)}</span>
                                                    </td>
                                                    <td className="enr-actions-cell">
                                                        <button
                                                            type="button"
                                                            className="enr-actions-trigger"
                                                            data-open={openMenuId === enrollment.id}
                                                            disabled={busyId === enrollment.id}
                                                            onClick={() =>
                                                                setOpenMenuId(openMenuId === enrollment.id ? null : enrollment.id)
                                                            }
                                                        >
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none" />
                                                                <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
                                                                <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
                                                            </svg>
                                                        </button>

                                                        {openMenuId === enrollment.id && (
                                                            <div className="enr-actions-menu" ref={menuRef}>
                                                                {statusSubmenuId === enrollment.id ? (
                                                                    <>
                                                                        <div className="enr-actions-submenu-label">Set status</div>
                                                                        {STATUS_OPTIONS.map((s) => (
                                                                            <button
                                                                                key={s}
                                                                                type="button"
                                                                                className="enr-actions-item"
                                                                                onClick={() => handleStatusChange(enrollment.id, s)}
                                                                            >
                                                                                <span className={`enr-status-badge ${getStatusClass(s)}`}>{s}</span>
                                                                            </button>
                                                                        ))}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            className="enr-actions-item"
                                                                            onClick={() => {
                                                                                setViewingEnrollment(enrollment);
                                                                                setOpenMenuId(null);
                                                                            }}
                                                                        >
                                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                                <circle cx="12" cy="12" r="3" />
                                                                            </svg>
                                                                            View Details
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="enr-actions-item"
                                                                            onClick={() => setStatusSubmenuId(enrollment.id)}
                                                                        >
                                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <path d="M12 20h9" />
                                                                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                                                            </svg>
                                                                            Change Status
                                                                        </button>
                                                                        <div className="enr-actions-divider" />
                                                                        <button
                                                                            type="button"
                                                                            className="enr-actions-item enr-actions-item--danger"
                                                                            onClick={() => handleDelete(enrollment.id)}
                                                                        >
                                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <polyline points="3 6 5 6 21 6" />
                                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                            </svg>
                                                                            Delete
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="enr-pagination">
                                    <div className="enr-pagination-info">
                                        Showing {(currentPage - 1) * PAGE_SIZE + 1}
                                        –{Math.min(currentPage * PAGE_SIZE, filteredEnrollments.length)} of {filteredEnrollments.length}
                                    </div>
                                    <div className="enr-pagination-controls">
                                        <button
                                            type="button"
                                            className="enr-page-btn"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        >
                                            Prev
                                        </button>
                                        {renderPageNumbers()}
                                        <button
                                            type="button"
                                            className="enr-page-btn"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>

            {viewingEnrollment && (
                <div className="enr-modal-overlay" onClick={() => setViewingEnrollment(null)}>
                    <div className="enr-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="enr-modal-header">
                            <h3 className="enr-modal-title">Enrollment Details</h3>
                            <button
                                type="button"
                                className="enr-modal-close"
                                onClick={() => setViewingEnrollment(null)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className="enr-modal-body">
                            <div className="enr-modal-row">
                                <span className="enr-modal-label">Student</span>
                                <span className="enr-modal-value">{viewingEnrollment.student_name || 'Unnamed student'}</span>
                            </div>
                            <div className="enr-modal-row">
                                <span className="enr-modal-label">Email</span>
                                <span className="enr-modal-value">{viewingEnrollment.email || '—'}</span>
                            </div>
                            <div className="enr-modal-row">
                                <span className="enr-modal-label">Phone</span>
                                <span className="enr-modal-value">{viewingEnrollment.phone || '—'}</span>
                            </div>
                            <div className="enr-modal-row">
                                <span className="enr-modal-label">Course</span>
                                <span className="enr-modal-value">{viewingEnrollment.course_name || 'Unspecified'}</span>
                            </div>
                            <div className="enr-modal-row">
                                <span className="enr-modal-label">Status</span>
                                <span className={`enr-status-badge ${getStatusClass(viewingEnrollment.status)}`}>
                                    {viewingEnrollment.status}
                                </span>
                            </div>
                            <div className="enr-modal-row">
                                <span className="enr-modal-label">Enrolled</span>
                                <span className="enr-modal-value">{formatDate(viewingEnrollment.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEnrollments;
