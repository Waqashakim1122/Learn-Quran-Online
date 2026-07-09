import React, { useState, useEffect, useMemo } from "react";
import AdminSidebar from "../MyComponents/Sidebar/Sidebar";
import AdminNavbar from "../MyComponents/AdminNavebar/Adminnavbar";
import supabase from "../../lib/supabaseClient";
import "./AdminEnrollments.css";

const PAGE_SIZE = 10;

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

const AdminEnrollments = () => {

    const [showSidebar, setShowSidebar] = useState(false);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [enrollments, setEnrollments] = useState([]);

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

    const loadEnrollments = async () => {

        try {

            setLoading(true);

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

            setError("Unable to load enrollments.");

        } finally {

            setLoading(false);

        }

    };

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

    const totalPages = Math.ceil(
        filteredEnrollments.length / PAGE_SIZE
    );

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

    const getInitials = (name) => {

        if (!name) return "?";

        const words = name.split(" ");

        if (words.length === 1)
            return words[0].substring(0, 2).toUpperCase();

        return (
            words[0][0] +
            words[1][0]
        ).toUpperCase();

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

        if (days === 0) return "Today";

        if (days === 1) return "Yesterday";

        if (days < 7)
            return `${days} days ago`;

        if (days < 30)
            return `${Math.floor(days / 7)} weeks ago`;

        return `${Math.floor(days / 30)} months ago`;

    };    return (
        <div className="enr-page">

            <AdminNavbar
                section="Admin Panel"
                title="Enrollments"
            />

            <div className="enr-body">

                <AdminSidebar
                    showSidebar={showSidebar}
                    toggleSidebar={toggleSidebar}
                />

                <main className="enr-main">

                    <button
                        className="enr-mobile-menu"
                        onClick={toggleSidebar}
                    >
                        ☰ Menu
                    </button>

                    {/* ================= HEADER ================= */}

                    <div className="enr-header">

                        <div>

                            <h1>
                                Student Enrollments
                            </h1>

                            <p>
                                Manage and monitor all student enrollments.
                            </p>

                        </div>

                        <button className="enr-export-btn">

                            Export CSV

                        </button>

                    </div>

                    {/* ================= STATS ================= */}

                    <div className="enr-stats">

                        <div className="enr-stat-card">

                            <span>Total Enrollments</span>

                            <h2>
                                {statistics.total}
                            </h2>

                        </div>

                        <div className="enr-stat-card">

                            <span>This Week</span>

                            <h2>
                                {statistics.thisWeek}
                            </h2>

                        </div>

                        <div className="enr-stat-card">

                            <span>Active</span>

                            <h2>
                                {statistics.active}
                            </h2>

                        </div>

                        <div className="enr-stat-card">

                            <span>Pending</span>

                            <h2>
                                {statistics.pending}
                            </h2>

                        </div>

                    </div>

                    {/* ================= FILTERS ================= */}

                    <div className="enr-toolbar">

                        <input
                            type="text"
                            placeholder="Search student..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="enr-search"
                        />

                        <select
                            value={courseFilter}
                            onChange={(e) =>
                                setCourseFilter(e.target.value)
                            }
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
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >

                            <option value="all">
                                All Status
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
                        >

                            <option value="newest">
                                Newest
                            </option>

                            <option value="oldest">
                                Oldest
                            </option>

                        </select>

                    </div>

                    {/* ================= TABLE ================= */}

                    <div className="enr-table-card">

                        {loading ? (

                            <div className="enr-loading">

                                Loading enrollments...

                            </div>

                        ) : error ? (

                            <div className="enr-error">

                                {error}

                            </div>

                        ) : (

                            <div className="enr-table-wrapper">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>Student</th>

                                            <th>Email</th>

                                            <th>Phone</th>

                                            <th>Course</th>

                                            <th>Status</th>

                                            <th>Date</th>

                                            <th>Action</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {paginatedEnrollments.map(student => (

                                            <tr key={student.id}>

                                                <td>

                                                    <div className="enr-student">

                                                        <div className="enr-avatar">

                                                            {getInitials(student.student_name)}

                                                        </div>

                                                        <div>

                                                            <h4>

                                                                {student.student_name}

                                                            </h4>

                                                            <span>

                                                                {formatRelative(student.created_at)}

                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td>

                                                    {student.email}

                                                </td>

                                                <td>

                                                    {student.phone}

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

                                                    {formatDate(student.created_at)}

                                                </td>

                                                <td>

                                                    <div className="enr-actions">

                                                        <button>

                                                            View

                                                        </button>

                                                        <button>

                                                            Edit

                                                        </button>

                                                        <button className="danger">

                                                            Delete

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>
