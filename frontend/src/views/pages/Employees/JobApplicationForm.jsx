import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobApplicationForm = ({ jobPostingId }) => {
    const [application, setApplication] = useState({
        applicantName: '',
        applicantEmail: '',
        applicantPhone: '',
        resumeUrl: ''
    });
    const [error, setError] = useState('');
    const [jobPosting, setJobPosting] = useState(null);

    useEffect(() => {
        if (jobPostingId) {
            axios.get(`/api/job-postings/${jobPostingId}`)
                .then(response => setJobPosting(response.data.data))
                .catch(error => console.error('Error fetching job posting:', error));
        }
    }, [jobPostingId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setApplication({ ...application, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!jobPosting || new Date() > new Date(jobPosting.deadline)) {
            setError('Cannot submit application. The job posting has expired.');
            return;
        }

        axios.post('/api/job-applications/submit', { ...application, jobPostingId })
            .then(response => {
                alert('Application submitted successfully');
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.error) {
                    setError(error.response.data.error);
                } else {
                    setError('An error occurred while submitting your application');
                }
            });
    };

    return (
        <div>
            <h2>Job Application Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="applicantName" value={application.applicantName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="applicantEmail" value={application.applicantEmail} onChange={handleChange} required />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" name="applicantPhone" value={application.applicantPhone} onChange={handleChange} required />
                </div>
                <div>
                    <label>Resume URL:</label>
                    <input type="text" name="resumeUrl" value={application.resumeUrl} onChange={handleChange} required />
                </div>
                <button type="submit">Submit Application</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default JobApplicationForm;
