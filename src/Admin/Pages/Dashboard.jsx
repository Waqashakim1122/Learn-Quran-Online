import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';
import supabase from '../../lib/supabaseClient';
import './Dashboard.css';

/* ================= ICONS ================= */

const IconBook = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
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

const IconClock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="16 9 11 14 8 11" />
    </svg>
);

const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconList = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

const IconArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const IconAlertCircle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const STATUS_COLORS = {
    Active: 'success',
    Pending: 'warning',
    Trial: 'info',
    Cancelled: 'danger',
};

const EMPTY_STATS = {
    totalCourses: 0,
    totalEnrollments: 0,
    pending: 0,
    active: 0,
};

const StatSkeleton = () => (
    <div className="db-stat-card">
        <div className="db-skel db-skel-icon" />
        <div style={{ flex: 1 }}>
            <div className="db-skel" style={{ width: '90px', height: '12px', marginBottom: '10px' }} />
            <div className="db-skel" style={{ width: '50px', height: '26px' }} />
        </div>
    </div>
);

const RecentRowSkeleton = () => (
    <tr aria-hidden="true">
        <td><div className="db-skel" style={{ width: '120px' }} /></td>
        <td><div className="db-skel db-skel-pill" /></td>
        <td><div className="db-skel db-skel-pill" /></td>
        <td><div className="db-skel" style={{ width: '80px' }} /></td>
    </tr>
);

const Dashboard = () => {
    const navigate = useNavigate();

    const [showSidebar, setShowSidebar] = useState(false);
    const toggleSidebar = () => setShowSidebar((prev) => !prev);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(EMPTY_STATS);
    const [recentEnrollments, setRecentEnrollments] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                coursesCountRes,
                enrollmentsCountRes,
                pendingCountRes,
                activeCountRes,
                recentRes,
            ] = await Promise.all([
                supabase.from('courses').select('*', { count: 'exact', head: true }),
                supabase.from('enrollments').select('*', { count: 'exact', head: true }),
                supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
                supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
                supabase.from('enrollments').select('*').order('created_at', { ascending: false }).limit(5),
            ]);

            const firstError =
                coursesCountRes.error ||
                enrollmentsCountRes.error ||
                pendingCountRes.error ||
                activeCountRes.error ||
                recentRes.error;

            if (firstError) throw firstError;

            setStats({
                totalCourses: coursesCountRes.count || 0,
                totalEnrollments: enrollmentsCountRes.count || 0,
                pending: pendingCountRes.count || 0,
                active: activeCountRes.count || 0,
            });

            setRecentEnrollments(recentRes.data || []);
        } catch (err) {
            setError('Unable to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatRelative = (date) => {
        const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;
        if (days < 30) return `${Math.floor(days / 7)}w ago`;
        return `${Math.floor(days / 30)}mo ago`;
    };

    return (
        <div className="db-page">

            <AdminNavbar />

            <div className="db-body">

                <AdminSidebar
                    showSidebar={showSidebar}
                    toggleSidebar={toggleSidebar}
                />

                <main className="db-main">

                    <button
                        type="button"
                        className="db-mobile-menu"
                        onClick={toggleSidebar}
                        aria-label="Toggle navigation menu"
                    >
                        ☰ Menu
                    </button>

                    <div className="db-header">
                        <div>
                            <h1>Dashboard</h1>
                            <p>Welcome back — here's what's happening today.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="db-alert danger" role="alert">
                            <IconAlertCircle />
                            <span>{error}</span>
                            <button type="button" className="db-retry-btn" onClick={loadDashboard}>
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* ================= STATS ================= */}

                    <div className="db-stats">

                        {loading ? (
                            <>
                                <StatSkeleton />
                                <StatSkeleton />
                                <StatSkeleton />
                                <StatSkeleton />
                            </>
                        ) : (
                            <>
                                <div className="db-stat-card">
                                    <div className="db-stat-icon blue"><IconBook /></div>
                                    <div>
                                        <span>Total Courses</span>
                                        <h2>{stats.totalCourses}</h2>
                                    </div>
                                </div>

                                <div className="db-stat-card">
                                    <div className="db-stat-icon green"><IconUsers /></div>
                                    <div>
                                        <span>Total Enrollments</span>
                                        <h2>{stats.totalEnrollments}</h2>
                                    </div>
                                </div>

                                <div className="db-stat-card">
                                    <div className="db-stat-icon orange"><IconClock /></div>
                                    <div>
                                        <span>Pending Requests</span>
                                        <h2>{stats.pending}</h2>
                                    </div>
                                </div>

                                <div className="db-stat-card">
                                    <div className="db-stat-icon green"><IconCheck /></div>
                                    <div>
                                        <span>Active Students</span>
                                        <h2>{stats.active}</h2>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>

                    {/* ================= QUICK ACTIONS ================= */}

                    <div className="db-section-label">Quick Actions</div>

                    <div className="db-quick-actions">

                        <button type="button" className="db-action-card" onClick={() => navigate('/addCourse')}>
                            <div className="db-action-icon blue"><IconPlus /></div>
                            <div className="db-action-text">
                                <h4>Add Course</h4>
                                <p>Create a new course listing</p>
                            </div>
                            <IconArrowRight />
                        </button>

                        <button type="button" className="db-action-card" onClick={() => navigate('/enrollments')}>
                            <div className="db-action-icon green"><IconUsers /></div>
                            <div className="db-action-text">
                                <h4>View Enrollments</h4>
                                <p>Review and manage requests</p>
                            </div>
                            <IconArrowRight />
                        </button>

                        <button type="button" className="db-action-card" onClick={() => navigate('/courselist')}>
                            <div className="db-action-icon orange"><IconList /></div>
                            <div className="db-action-text">
                                <h4>Manage Courses</h4>
                                <p>Edit or remove existing courses</p>
                            </div>
                            <IconArrowRight />
                        </button>

                    </div>

                    {/* ================= RECENT ENROLLMENTS ================= */}

                    <div className="db-recent-header">
                        <div className="db-section-label" style={{ marginBottom: 0 }}>Recent Enrollments</div>
                        <button type="button" className="db-view-all-btn" onClick={() => navigate('/enrollments')}>
                            View All
                            <IconArrowRight />
                        </button>
                    </div>

                    <div className="db-table-card">

                        {!loading && recentEnrollments.length === 0 && !error ? (

                            <div className="db-empty">
                                <p>No enrollments yet. New requests will show up here.</p>
                            </div>

                        ) : (

                            <div className="db-table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Course</th>
                                            <th>Status</th>
                                            <th>Enrolled</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {loading ? (
                                            <>
                                                <RecentRowSkeleton />
                                                <RecentRowSkeleton />
                                                <RecentRowSkeleton />
                                            </>
                                        ) : recentEnrollments.map((enr) => (
                                            <tr key={enr.id}>
                                                <td className="db-student-name">
                                                    {enr.student_name || 'Unnamed Student'}
                                                </td>
                                                <td>{enr.course_name}</td>
                                                <td>
                                                    <span className={`db-status-badge ${STATUS_COLORS[enr.status] || 'warning'}`}>
                                                        {enr.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="db-muted">{formatRelative(enr.created_at)}</td>
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

export default Dashboard;
