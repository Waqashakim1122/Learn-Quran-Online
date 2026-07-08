import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';
import supabase from '../../lib/supabaseClient';
import './AdminEnrollments.css';

const COURSE_STYLES = {
    'Quran Hifz': 'green',
    'Quran Nazra': 'gold',
    'Quran Reading': 'gold',
    'Tajweed Course': 'green',
    'Noorani Qaida': 'brown',
};

const getCourseClass = (course) => {
    const key = COURSE_STYLES[course];
    return key ? `enr-badge--${key}` : 'enr-badge--default';
};

const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [courseFilter, setCourseFilter] = useState('all');
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => setShowSidebar((prev) => !prev);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const { data, error } = await supabase
                    .from('enrollments')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setEnrollments(data || []);
            } catch (error) {
                setMessage('Failed to fetch enrollments. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    const courseOptions = useMemo(() => {
        const unique = new Set(enrollments.map((e) => e.course_name).filter(Boolean));
        return Array.from(unique);
    }, [enrollments]);

    const filteredEnrollments = useMemo(() => {
        let list = enrollments;
        if (courseFilter !== 'all') {
            list = list.filter((e) => e.course_name === courseFilter);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((e) =>
                [e.student_name, e.email, e.course_name]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(q))
            );
        }
        return list;
    }, [enrollments, search, courseFilter]);

    const stats = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);

        const thisWeek = enrollments.filter((e) => new Date(e.created_at) >= weekAgo).length;

        const byCourse = enrollments.reduce((acc, e) => {
            const key = e.course_name || 'Unspecified';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        const topCourse = Object.entries(byCourse).sort((a, b) => b[1] - a[1])[0];

        return {
            total: enrollments.length,
            thisWeek,
            topCourse: topCourse ? topCourse[0] : '—',
            topCourseCount: topCourse ? topCourse[1] : 0,
        };
    }, [enrollments]);

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
                            <div className="enr-stat-icon enr-stat-icon--brown">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                            </div>
                            <div>
                                <div className="enr-stat-value enr-stat-value--sm">{stats.topCourse}</div>
                                <div className="enr-stat-label">Most Popular ({stats.topCourseCount})</div>
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
                                <div className="enr-select-wrap">
                                    <select
                                        value={courseFilter}
                                        onChange={(e) => setCourseFilter(e.target.value)}
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

                                <div className="enr-search">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="7" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search name, email or course..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
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
                            <div className="enr-table-wrap">
                                <table className="enr-table">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Course</th>
                                            <th>Enrolled</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEnrollments.map((enrollment) => (
                                            <tr key={enrollment.id}>
                                                <td>
                                                    <div className="enr-student">
                                                        <div className="enr-avatar">{getInitials(enrollment.student_name)}</div>
                                                        <span className="enr-student-name">
                                                            {enrollment.student_name || 'Unnamed student'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="enr-muted">{enrollment.email || '—'}</td>
                                                <td className="enr-muted">{enrollment.phone || '—'}</td>
                                                <td>
                                                    <span className={`enr-course-badge ${getCourseClass(enrollment.course_name)}`}>
                                                        {enrollment.course_name || 'Unspecified'}
                                                    </span>
                                                </td>
                                                <td className="enr-date-cell">
                                                    <span className="enr-muted">{formatDate(enrollment.created_at)}</span>
                                                    <span className="enr-time-ago">{timeAgo(enrollment.created_at)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminEnrollments;
