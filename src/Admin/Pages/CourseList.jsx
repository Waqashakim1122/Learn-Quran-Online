import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../MyComponents/AdminNavebar/Adminnavbar';
import AdminSidebar from '../MyComponents/Sidebar/Sidebar';
import supabase from '../../lib/supabaseClient';
import './CourseList.css';

const LEVEL_COLORS = {
    Beginner: 'green',
    Intermediate: 'blue',
    Advanced: 'purple',
    'All Levels': 'gold',
};

const DESCRIPTION_PREVIEW_LENGTH = 100;
const MESSAGE_AUTO_DISMISS_MS = 4000;

const EDITABLE_FIELDS = ['title', 'description', 'duration', 'level', 'price'];

/* ================= ICONS ================= */

const IconPlus = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IconSearch = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const IconSave = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconX = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const IconTrash = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
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

const IconEmpty = () => (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
);

/* Placeholder rows while the initial fetch is in flight — keeps the
   table shell stable instead of collapsing to a loading string. */
const SkeletonRows = ({ rows = 5 }) => (
    <>
        {Array.from({ length: rows }, (_, i) => (
            <tr key={i} aria-hidden="true">
                <td><div className="cl-skel" style={{ width: '16px' }} /></td>
                <td><div className="cl-skel" style={{ width: '120px' }} /></td>
                <td><div className="cl-skel" style={{ width: '220px' }} /></td>
                <td><div className="cl-skel" style={{ width: '70px' }} /></td>
                <td><div className="cl-skel cl-skel-pill" /></td>
                <td><div className="cl-skel" style={{ width: '70px' }} /></td>
                <td><div className="cl-skel" style={{ width: '60px' }} /></td>
            </tr>
        ))}
    </>
);

const CourseList = () => {
    const navigate = useNavigate();

    const [showSidebar, setShowSidebar] = useState(false);
    const toggleSidebar = () => setShowSidebar((prev) => !prev);

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text }
    const [search, setSearch] = useState('');
    const [expandedIds, setExpandedIds] = useState(() => new Set());

    // Editing is kept as a separate draft, not a live mutation of
    // `courses` — this is what makes "Cancel" actually work instead
    // of leaving half-typed edits stuck in the list.
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), MESSAGE_AUTO_DISMISS_MS);
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            setCourses(data || []);
        } catch (error) {
            showMessage('danger', 'Failed to fetch courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = useMemo(() => {
        if (!search.trim()) return courses;
        const q = search.trim().toLowerCase();
        return courses.filter((course) =>
            (course.title || '').toLowerCase().includes(q) ||
            (course.level || '').toLowerCase().includes(q)
        );
    }, [courses, search]);

    const toggleDescription = (courseId) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            next.has(courseId) ? next.delete(courseId) : next.add(courseId);
            return next;
        });
    };

    const handleEditClick = (course) => {
        setEditingId(course.id);
        setDraft({
            title: course.title || '',
            description: course.description || '',
            duration: course.duration || '',
            level: course.level || '',
            price: course.price || '',
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setDraft(null);
    };

    const handleDraftChange = (e) => {
        const { name, value } = e.target;
        setDraft((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = async (courseId) => {
        const hasEmptyField = EDITABLE_FIELDS.some((field) => !String(draft[field]).trim());
        if (hasEmptyField) {
            showMessage('danger', 'Please fill in all fields before saving.');
            return;
        }

        setSaving(true);

        try {
            const { error } = await supabase
                .from('courses')
                .update({
                    title: draft.title.trim(),
                    description: draft.description.trim(),
                    duration: draft.duration.trim(),
                    level: draft.level,
                    price: draft.price.trim(),
                })
                .eq('id', courseId);

            if (error) throw error;

            setCourses((prev) =>
                prev.map((course) => (course.id === courseId ? { ...course, ...draft } : course))
            );

            showMessage('success', 'Course updated successfully.');
            setEditingId(null);
            setDraft(null);
        } catch (error) {
            showMessage('danger', 'Failed to update course. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (course) => {
        if (!window.confirm(`Delete "${course.title}"? This can't be undone.`)) return;

        try {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', course.id);

            if (error) throw error;

            setCourses((prev) => prev.filter((c) => c.id !== course.id));
            if (editingId === course.id) handleCancelEdit();
            showMessage('success', 'Course deleted successfully.');
        } catch (error) {
            showMessage('danger', 'Failed to delete course. Please try again.');
        }
    };

    return (
        <div className="cl-page">

            <AdminNavbar />

            <div className="cl-body">

                <AdminSidebar
                    showSidebar={showSidebar}
                    toggleSidebar={toggleSidebar}
                />

                <main className="cl-main">

                    <button
                        type="button"
                        className="cl-mobile-menu"
                        onClick={toggleSidebar}
                        aria-label="Toggle navigation menu"
                    >
                        ☰ Menu
                    </button>

                    {/* ================= HEADER ================= */}

                    <div className="cl-header">

                        <div>
                            <h1>Courses List</h1>
                            <p>View, edit, and manage every course in your catalog.</p>
                        </div>

                        <button
                            type="button"
                            className="cl-add-btn"
                            onClick={() => navigate('/addCourse')}
                        >
                            <IconPlus />
                            Add Course
                        </button>

                    </div>

                    {/* ================= ALERT ================= */}

                    {message && (
                        <div className={`cl-alert ${message.type}`} role="alert">
                            {message.type === 'success' ? <IconCheckCircle /> : <IconAlertCircle />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {/* ================= SEARCH ================= */}

                    <div className="cl-toolbar">
                        <div className="cl-search-wrap">
                            <IconSearch />
                            <input
                                type="text"
                                placeholder="Search by title or level..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="cl-search"
                                aria-label="Search courses"
                            />
                        </div>
                    </div>

                    {/* ================= TABLE ================= */}

                    <div className="cl-table-card">

                        {!loading && filteredCourses.length === 0 ? (

                            <div className="cl-empty">
                                <div className="cl-empty-icon"><IconEmpty /></div>
                                <h3>{courses.length === 0 ? 'No courses yet' : 'No courses found'}</h3>
                                <p>
                                    {courses.length === 0
                                        ? 'Get started by adding your first course.'
                                        : 'Try a different search term.'}
                                </p>
                                {courses.length === 0 && (
                                    <button type="button" className="cl-add-btn" onClick={() => navigate('/addCourse')}>
                                        <IconPlus />
                                        Add Course
                                    </button>
                                )}
                            </div>

                        ) : (

                            <div className="cl-table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Duration</th>
                                            <th>Level</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {loading ? (

                                            <SkeletonRows />

                                        ) : filteredCourses.map((course, index) => {

                                            const isEditing = editingId === course.id;
                                            const expanded = expandedIds.has(course.id);
                                            const description = course.description || '';
                                            const isLong = description.length > DESCRIPTION_PREVIEW_LENGTH;

                                            return (
                                                <tr key={course.id} className={isEditing ? 'cl-row-editing' : ''}>

                                                    <td>{index + 1}</td>

                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="title"
                                                                value={draft.title}
                                                                onChange={handleDraftChange}
                                                                className="cl-cell-input"
                                                            />
                                                        ) : (
                                                            <span className="cl-title">{course.title}</span>
                                                        )}
                                                    </td>

                                                    <td className="cl-description-cell">
                                                        {isEditing ? (
                                                            <textarea
                                                                name="description"
                                                                rows={3}
                                                                value={draft.description}
                                                                onChange={handleDraftChange}
                                                                className="cl-cell-input"
                                                            />
                                                        ) : (
                                                            <>
                                                                {expanded || !isLong
                                                                    ? description
                                                                    : `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}…`}
                                                                {isLong && (
                                                                    <button
                                                                        type="button"
                                                                        className="cl-readmore-btn"
                                                                        onClick={() => toggleDescription(course.id)}
                                                                    >
                                                                        {expanded ? 'Read Less' : 'Read More'}
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="duration"
                                                                value={draft.duration}
                                                                onChange={handleDraftChange}
                                                                className="cl-cell-input"
                                                            />
                                                        ) : (
                                                            course.duration
                                                        )}
                                                    </td>

                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="level"
                                                                value={draft.level}
                                                                onChange={handleDraftChange}
                                                                className="cl-cell-input"
                                                            />
                                                        ) : (
                                                            <span className={`level-badge ${LEVEL_COLORS[course.level] || ''}`}>
                                                                {course.level}
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                name="price"
                                                                value={draft.price}
                                                                onChange={handleDraftChange}
                                                                className="cl-cell-input"
                                                            />
                                                        ) : (
                                                            <span className="cl-price">{course.price}</span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div className="cl-actions">
                                                            {isEditing ? (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="save"
                                                                        onClick={() => handleSaveClick(course.id)}
                                                                        disabled={saving}
                                                                        aria-label={`Save ${course.title}`}
                                                                    >
                                                                        <IconSave />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="cancel"
                                                                        onClick={handleCancelEdit}
                                                                        disabled={saving}
                                                                        aria-label="Cancel editing"
                                                                    >
                                                                        <IconX />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="edit"
                                                                        onClick={() => handleEditClick(course)}
                                                                        aria-label={`Edit ${course.title}`}
                                                                    >
                                                                        <IconEdit />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="danger"
                                                                        onClick={() => handleDelete(course)}
                                                                        aria-label={`Delete ${course.title}`}
                                                                    >
                                                                        <IconTrash />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>

                                                </tr>
                                            );
                                        })}

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

export default CourseList;
