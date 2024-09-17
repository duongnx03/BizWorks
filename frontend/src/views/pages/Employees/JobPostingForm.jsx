import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobPostingForm = ({ jobPostingId, onSuccess }) => {
    const [jobPosting, setJobPosting] = useState({
        title: '',
        description: '',
        postedDate: '',
        deadline: '',
        departmentId: '',
        positionId: '',
        location: '',
        employmentType: '',
        requirements: '',
        salaryRangeMin: '',
        salaryRangeMax: ''
    });
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        // Fetch departments and positions for dropdowns
        axios.get('/api/departments')
            .then(response => setDepartments(response.data.data))
            .catch(error => console.error('Error fetching departments:', error));

        axios.get('/api/positions')
            .then(response => setPositions(response.data.data))
            .catch(error => console.error('Error fetching positions:', error));

        if (jobPostingId) {
            axios.get(`/api/job-postings/${jobPostingId}`)
                .then(response => setJobPosting(response.data.data))
                .catch(error => console.error('Error fetching job posting:', error));
        }
    }, [jobPostingId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobPosting({ ...jobPosting, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = jobPostingId ? `/api/job-postings/${jobPostingId}` : '/api/job-postings/create';
        const method = jobPostingId ? 'put' : 'post';

        axios[method](url, jobPosting)
            .then(response => {
                alert('Job posting saved successfully');
                if (onSuccess) onSuccess();
            })
            .catch(error => console.error('Error saving job posting:', error));
    };

    return (
        <div>
            <h2>{jobPostingId ? 'Edit Job Posting' : 'Create Job Posting'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={jobPosting.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={jobPosting.description} onChange={handleChange} required />
                </div>
                <div>
                    <label>Posted Date:</label>
                    <input type="date" name="postedDate" value={jobPosting.postedDate} onChange={handleChange} required />
                </div>
                <div>
                    <label>Deadline:</label>
                    <input type="date" name="deadline" value={jobPosting.deadline} onChange={handleChange} required />
                </div>
                <div>
                    <label>Department:</label>
                    <select name="departmentId" value={jobPosting.departmentId} onChange={handleChange} required>
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Position:</label>
                    <select name="positionId" value={jobPosting.positionId} onChange={handleChange} required>
                        <option value="">Select Position</option>
                        {positions.map(pos => (
                            <option key={pos.id} value={pos.id}>{pos.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Location:</label>
                    <input type="text" name="location" value={jobPosting.location} onChange={handleChange} required />
                </div>
                <div>
                    <label>Employment Type:</label>
                    <input type="text" name="employmentType" value={jobPosting.employmentType} onChange={handleChange} required />
                </div>
                <div>
                    <label>Requirements:</label>
                    <textarea name="requirements" value={jobPosting.requirements} onChange={handleChange} required />
                </div>
                <div>
                    <label>Salary Range Min:</label>
                    <input type="number" name="salaryRangeMin" value={jobPosting.salaryRangeMin} onChange={handleChange} required />
                </div>
                <div>
                    <label>Salary Range Max:</label>
                    <input type="number" name="salaryRangeMax" value={jobPosting.salaryRangeMax} onChange={handleChange} required />
                </div>
                <button type="submit">Save Job Posting</button>
            </form>
        </div>
    );
};

export default JobPostingForm;
