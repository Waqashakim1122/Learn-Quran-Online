import React, { useState, useEffect, useMemo, useCallback } from "react";
import AdminSidebar from "../MyComponents/Sidebar/Sidebar";
import AdminNavbar from "../MyComponents/AdminNavebar/Adminnavbar";
import supabase from "../../lib/supabaseClient";
import "./AdminEnrollments.css";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

const STATUS_COLORS = {
    Active: "success",
    Pending: "warning",
    Trial: "info",
    Cancelled: "danger"
};

const COURSE_COLORS = {
    "Quran Hifz": "green",
    "Quran Nazra": "blue",
    "Quran Reading": "purple",
    "Noorani Qaida": "orange",
    "Tajweed Course": "gold"
};

/* Rotating palette for named-student avatars so the table doesn't read
   as one flat wall of gray circles. Deterministic per-name (hashed),
   so the same student always gets the same color across renders/pages. */
const AVATAR_PALETTE = [
    { bg: "#DCFCE7", fg: "#166534" },
    { bg: "#DBEAFE", fg: "#1D4ED8" },
    { bg: "#FEF3C7", fg: "#B45309" },
    { bg: "#F3E8FF", fg: "#7E22CE" },
    { bg: "#FFE4E6", fg: "#BE123C" },
    { bg: "#E0F2FE", fg: "#0369A1" },
];

const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

/* ================= ICONS ================= */

const IconSearch = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconDownload = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M5 21h14" />
    </svg>
);

const IconPlus = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconRefresh = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 4v6h-6" />
        <path d="M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" />
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

const IconTrending = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const IconCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="16 9 11 14 8 11" />
    </svg>
);

const IconClock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

const IconEmpty = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

/* Renders N shimmering placeholder rows while data is loading, so the
   table shell (headers, toolbar) stays stable instead of collapsing
   into a spinner — this is what keeps layout shift to zero. */
const SkeletonRows = ({ rows = 6 }) => (
    <>
        {Array.from({ length: rows }, (_, i) => (
            <tr key={i} className="enr-skeleton-row" aria-hidden="true">
                <td>
                    <div className="enr-student">
                        <div className="enr-skel enr-skel-avatar" />
                        <div className="enr-skel enr-skel-line" style={{ width: "120px" }} />
                    </div>
                </td>
                <td><div className="enr-skel enr-skel-line" style={{ width: "140px" }} /></td>
                <td><div className="enr-skel enr-skel-line" style={{ width: "90px" }} /></td>
                <td><div className="enr-skel enr-skel-pill" /></td>
                <td><div className="enr-skel enr-skel-pill" /></td>
                <td><div className="enr-skel enr-skel-line" style={{ width: "80px" }} /></td>
                <td><div className="enr-skel enr-skel-line" style={{ width: "100px" }} /></td>
            </tr>
        ))}
    </>
);

/* Windowed pagination: always shows first/last page, current page +/- 1,
   and collapses the rest into an ellipsis instead of rendering a button
   for every page — keeps the control usable once there are 20+ pages. */
const getPageWindow = (current, total) => {
    const pages = [];
    const addRange = (start, end) => {
        for (let i = start; i <= end; i++) pages.push(i);
    };

    if (total <= 7) {
        addRange(1, total);
        return pages;
    }

    pages.push(1);

    if (current > 3) pages.push("ellipsis-start");

    addRange(Math.max(2, current - 1), Math.min(total - 1, current + 1));

    if (current < total - 2) pages.push("ellipsis-end");

    pages.push(total);

    return pages;
};

const AdminEnrollments = () => {

    const [showSidebar, setShowSidebar] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [enrollments, setEnrollments] = useState([]);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [courseFilter, setCourseFilter] = useState("all");

    const [statusFilter, setStatusFilter] = useState("all");

    const [sortBy, setSortBy] = useState("newest");

    const [currentPage, setCurrentPage] = useState(1);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    useEffect(() => {

        loadEnrollments();

    }, []);

    /* Debounce the raw keystrokes into `search` so filtering (and the
       resulting re-render of a possibly large table) only runs once
       the user pauses typing, not on every character. */
    useEffect(() => {

        const handle = setTimeout(() => {
            setSearch(searchInput);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(handle);

    }, [searchInput]);

    const loadEnrollments = async () => {

        try {

            setLoading(true);
            setError("");

            const { data, error } = await supabase
                .from("enrollments")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            const formatted = (data || []).map(item => ({
                ...item,
                status: item.status || "Pending"
            }));

            setEnrollments(formatted);

        } catch (err) {

            setError("Unable to load enrollments. Please try again.");

        } finally {

            setLoading(false);

        }

    };

    const resetFilters = useCallback(() => {

        setSearchInput("");
        setSearch("");
        setCourseFilter("all");
        setStatusFilter("all");
        setSortBy("newest");
        setCurrentPage(1);

    }, []);

    const courseOptions = useMemo(() => {

        return [
            ...new Set(
                enrollments
                    .map(item => item.course_name)
                    .filter(Boolean)
            )
        ];

    }, [enrollments]);

    const statistics = useMemo(() => {

        const weekAgo = new Date();

        weekAgo.setDate(weekAgo.getDate() - 7);

        return {

            total: enrollments.length,

            thisWeek: enrollments.filter(item =>
                new Date(item.created_at) >= weekAgo
            ).length,

            active: enrollments.filter(item =>
                item.status === "Active"
            ).length,

            pending: enrollments.filter(item =>
                item.status === "Pending"
            ).length

        };

    }, [enrollments]);

    const filteredEnrollments = useMemo(() => {

        let data = [...enrollments];

        if (search.trim()) {

            const q = search.toLowerCase();

            data = data.filter(item =>

                (item.student_name || "")
                    .toLowerCase()
                    .includes(q)

                ||

                (item.email || "")
                    .toLowerCase()
                    .includes(q)

                ||

                (item.phone || "")
                    .toLowerCase()
                    .includes(q)

            );

        }

        if (courseFilter !== "all") {

            data = data.filter(
                item => item.course_name === courseFilter
            );

        }

        if (statusFilter !== "all") {

            data = data.filter(
                item => item.status === statusFilter
            );

        }

        if (sortBy === "oldest") {

            data.sort(
                (a, b) =>
                    new Date(a.created_at) -
                    new Date(b.created_at)
            );

        } else {

            data.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            );

        }

        return data;

    }, [
        enrollments,
        search,
        courseFilter,
        statusFilter,
        sortBy
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredEnrollments.length / PAGE_SIZE)
    );

    // Guard against being stranded on a page that no longer exists
    // once filters shrink the result set.
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    const paginatedEnrollments = useMemo(() => {

        const start = (currentPage - 1) * PAGE_SIZE;

        return filteredEnrollments.slice(
            start,
            start + PAGE_SIZE
        );

    }, [
        filteredEnrollments,
        currentPage
    ]);

    const pageWindow = useMemo(
        () => getPageWindow(currentPage, totalPages),
        [currentPage, totalPages]
    );

    const rangeStart = filteredEnrollments.length === 0
        ? 0
        : (currentPage - 1) * PAGE_SIZE + 1;

    const rangeEnd = Math.min(
        currentPage * PAGE_SIZE,
        filteredEnrollments.length
    );

    const getInitials = (name) => {

        if (!name) return "?";

        const words = name.trim().split(/\s+/);

        if (words.length === 1)
            return words[0].substring(0, 2).toUpperCase();

        return (
            words[0][0] +
            words[1][0]
        ).toUpperCase();

    };

    const getAvatarStyle = (name) => {

        if (!name) return { background: "#F1F5F9", color: "#94A3B8" };

        const palette = AVATAR_PALETTE[hashString(name) % AVATAR_PALETTE.length];

        return { background: palette.bg, color: palette.fg };

    };

    const formatDate = date =>

        new Date(date).toLocaleDateString(
            "en-US",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    const formatRelative = date => {

        const diff =
            Date.now() -
            new Date(date).getTime();

        const days = Math.floor(
            diff /
                (1000 * 60 * 60 * 24)
        );

        if (days <= 0) return "Today";

        if (days === 1) return "Yesterday";

        if (days < 7)
            return `${days}d ago`;

        if (days < 30)
            return `${Math.floor(days / 7)}w ago`;

        return `${Math.floor(days / 30)}mo ago`;

    };

    const hasActiveFilters =
        search || courseFilter !== "all" || statusFilter !== "all" || sortBy !== "newest";

    return (
        <div className="enr-page">

            <AdminNavbar />

            <div className="enr-body">

                <AdminSidebar
                    showSidebar={showSidebar}
                    toggleSidebar={toggleSidebar}
                />

                <main className="enr-main">

                    <button
                        className="enr-mobile-menu"
                        onClick={toggleSidebar}
                        aria-label="Toggle navigation menu"
                    >
                        ☰ Menu
                    </button>

                    {/* ================= HEADER ================= */}

                    <div className="enr-header">

                        <div>

                            <h1>
                                Enrollments
                            </h1>

                            <p>
                                Manage all student enrollments and requests
                            </p>

                        </div>

                        <div className="enr-header-actions">

                            <button className="enr-export-btn" type="button">

                                <IconDownload />
                                Export CSV

                            </button>

                            <button className="enr-add-btn" type="button">

                                <IconPlus />
                                Add Student

                            </button>

                        </div>

                    </div>

                    {/* ================= STATS ================= */}

                    <div className="enr-stats">

                        <div className="enr-stat-card">

                            <div className="enr-stat-icon green">
                                <IconUsers />
                            </div>

                            <div>

                                <span>Total Enrollments</span>

                                <h2>
                                    {statistics.total}
                                </h2>

                                <div className="enr-stat-sub">All time</div>

                            </div>

                        </div>

                        <div className="enr-stat-card">

                            <div className="enr-stat-icon blue">
                                <IconTrending />
                            </div>

                            <div>

                                <span>New This Week</span>

                                <h2>
                                    {statistics.thisWeek}
                                </h2>

                                <div className="enr-stat-sub">Last 7 days</div>

                            </div>

                        </div>

                        <div className="enr-stat-card">

                            <div className="enr-stat-icon green">
                                <IconCheck />
                            </div>

                            <div>

                                <span>Active Students</span>

                                <h2>
                                    {statistics.active}
                                </h2>

                                <div className="enr-stat-sub">Currently active</div>

                            </div>

                        </div>

                        <div className="enr-stat-card">

                            <div className="enr-stat-icon orange">
                                <IconClock />
                            </div>

                            <div>

                                <span>Pending Requests</span>

                                <h2>
                                    {statistics.pending}
                                </h2>

                                <div className="enr-stat-sub">Awaiting approval</div>

                            </div>

                        </div>

                    </div>

                    {/* ================= FILTERS ================= */}

                    <div className="enr-toolbar">

                        <div className="enr-search-wrap">

                            <IconSearch />

                            <input
                                type="text"
                                placeholder="Search by name, email or course..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="enr-search"
                                aria-label="Search enrollments"
                            />

                        </div>

                        <select
                            value={courseFilter}
                            onChange={(e) => {
                                setCourseFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            aria-label="Filter by course"
                        >

                            <option value="all">
                                All Courses
                            </option>

                            {courseOptions.map(course => (

                                <option
                                    key={course}
                                    value={course}
                                >

                                    {course}

                                </option>

                            ))}

                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            aria-label="Filter by status"
                        >

                            <option value="all">
                                All Statuses
                            </option>

                            <option value="Active">
                                Active
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Trial">
                                Trial
                            </option>

                            <option value="Cancelled">
                                Cancelled
                            </option>

                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value)
                            }
                            aria-label="Sort order"
                        >

                            <option value="newest">
                                Newest First
                            </option>

                            <option value="oldest">
                                Oldest First
                            </option>

                        </select>

                        <button
                            className="enr-reset-btn"
                            onClick={resetFilters}
                            type="button"
                            disabled={!hasActiveFilters}
                        >

                            <IconRefresh />
                            Reset

                        </button>

                    </div>

                    {/* ================= TABLE ================= */}

                    <div className="enr-table-card">

                        {error ? (

                            <div className="enr-error" role="alert">

                                <p>{error}</p>

                                <button className="enr-retry-btn" onClick={loadEnrollments} type="button">
                                    Try Again
                                </button>

                            </div>

                        ) : !loading && filteredEnrollments.length === 0 ? (

                            <div className="enr-empty">

                                <div className="enr-empty-icon"><IconEmpty /></div>

                                <h3>No enrollments found</h3>

                                <p>
                                    {hasActiveFilters
                                        ? "Try adjusting your search or filters."
                                        : "New enrollments will show up here."}
                                </p>

                                {hasActiveFilters && (
                                    <button className="enr-reset-btn" onClick={resetFilters} type="button">
                                        <IconRefresh />
                                        Clear filters
                                    </button>
                                )}

                            </div>

                        ) : (

                            <>

                            <div className="enr-table-wrapper" aria-busy={loading}>

                                <table>

                                    <thead>

                                        <tr>

                                            <th>Student</th>

                                            <th>Email</th>

                                            <th>Phone</th>

                                            <th>Course</th>

                                            <th>Status</th>

                                            <th>Enrolled</th>

                                            <th>Actions</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {loading ? (

                                            <SkeletonRows rows={Math.min(PAGE_SIZE, 6)} />

                                        ) : paginatedEnrollments.map(student => (

                                            <tr key={student.id}>

                                                <td>

                                                    <div className="enr-student">

                                                        <div
                                                            className="enr-avatar"
                                                            style={getAvatarStyle(student.student_name)}
                                                        >

                                                            {getInitials(student.student_name)}

                                                        </div>

                                                        <div>

                                                            <h4>

                                                                {student.student_name || "Unnamed Student"}

                                                            </h4>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td>

                                                    {student.email || <span className="enr-muted">—</span>}

                                                </td>

                                                <td>

                                                    {student.phone || <span className="enr-muted">—</span>}

                                                </td>

                                                <td>

                                                    <span
                                                        className={`course-badge ${COURSE_COLORS[student.course_name] || ""}`}
                                                    >

                                                        {student.course_name}

                                                    </span>

                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${STATUS_COLORS[student.status] || "warning"}`}
                                                    >

                                                        {student.status}

                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="enr-date">

                                                        <h5>{formatDate(student.created_at)}</h5>

                                                        <span>{formatRelative(student.created_at)}</span>

                                                    </div>

                                                </td>

                                                <td>

                                                    <div className="enr-actions">

                                                        <button className="view" aria-label={`View ${student.student_name || "student"}`} type="button">
                                                            <IconEye />
                                                        </button>

                                                        <button className="edit" aria-label={`Edit ${student.student_name || "student"}`} type="button">
                                                            <IconEdit />
                                                        </button>

                                                        <button className="danger" aria-label={`Delete ${student.student_name || "student"}`} type="button">
                                                            <IconTrash />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                            {!loading && (

                            <div className="enr-pagination">

                                <div className="enr-pagination-info">

                                    Showing <strong>{rangeStart}</strong> to <strong>{rangeEnd}</strong> of{" "}
                                    <strong>{filteredEnrollments.length}</strong> results

                                </div>

                                <div className="enr-pagination-controls">

                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        type="button"
                                        aria-label="Previous page"
                                    >
                                        Previous
                                    </button>

                                    {pageWindow.map((page, idx) =>
                                        typeof page === "number" ? (
                                            <button
                                                key={page}
                                                className={page === currentPage ? "active" : ""}
                                                onClick={() => setCurrentPage(page)}
                                                type="button"
                                                aria-current={page === currentPage ? "page" : undefined}
                                            >
                                                {page}
                                            </button>
                                        ) : (
                                            <span key={`${page}-${idx}`} className="enr-pagination-ellipsis">…</span>
                                        )
                                    )}

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        type="button"
                                        aria-label="Next page"
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>

                            )}

                            </>

                        )}

                    </div>

                </main>

            </div>

        </div>
    );

};

export default AdminEnrollments;
