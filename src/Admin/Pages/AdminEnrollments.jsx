import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';
import supabase from '../../lib/supabaseClient';
import './AdminEnrollments.css';

const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
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
                setEnrollments(data);
            } catch (error) {
                setMessage('Failed to fetch enrollments. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    const filteredEnrollments = useMemo(() => {
        if (!search.trim()) return enrollments;
        const q = search.toLowerCase();
        return enrollments.filter((e) =>
            [e.student_name, e.email, e.course_name]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(q))
        );
    }, [enrollments, search]);

    const getInitials = (name) => {
        if (!name) return '—';
        const parts = name.trim().split(' ');
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : name.slice(0, 2).toUpperCase();
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
                            <h1 className="enr-title">
                                Enrollments
                                <span className="enr-count-badge">{enrollments.length}</span>
                            </h1>
                            <p className="enr-subtitle">All trial and course enrollment requests, most recent first.</p>
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

                    <div className="enr-card">
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
                                        : 'Try a different search term.'}
                                </div>
                            </div>
                        ) : (
                            <div className="enr-table-wrap">
                                <table className="enr-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Student</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Course</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEnrollments.map((enrollment, index) => (
                                            <tr key={enrollment.id}>
                                                <td className="enr-row-index">{index + 1}</td>
                                                <td>
                                                    <div className="enr-student">
                                                        <div className="enr-avatar">{getInitials(enrollment.student_name)}</div>
                                                        <span className="enr-student-name">{enrollment.student_name}</span>
                                                    </div>
                                                </td>
                                                <td className="enr-muted">{enrollment.email}</td>
                                                <td className="enr-muted">{enrollment.phone}</td>
                                                <td>
                                                    <span className="enr-course-badge">{enrollment.course_name}</span>
                                                </td>
                                                <td className="enr-muted">
                                                    {new Date(enrollment.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
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
