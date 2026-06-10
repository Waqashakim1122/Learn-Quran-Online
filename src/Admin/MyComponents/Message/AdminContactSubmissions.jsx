import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminContactSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get('https://665e97541e9017dc16f093eb.mockapi.io/ContactSubmissions');
                setSubmissions(response.data);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }
        };

        fetchSubmissions();
    }, []);

    return (
        <div className="container mt-5">
            <h3>Contact Form Submissions</h3>
            <ul>
                {submissions.map((submission) => (
                    <li key={submission.id}>
                        <p>Name: {submission.name}</p>
                        <p>Phone: {submission.phone}</p>
                        <p>Email: {submission.email}</p>
                        <p>Message: {submission.message}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminContactSubmissions;
