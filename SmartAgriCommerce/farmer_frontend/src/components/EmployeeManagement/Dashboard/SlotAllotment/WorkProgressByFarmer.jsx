import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WorkProgress.css';

const WorkProgressByFarmer = ({ farmerId }) => {
    const [workProgress, setWorkProgress] = useState([]);
    const [error, setError] = useState('');

    // Fetch the work progress using POST method
    const fetchWorkProgress = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/workprogress/work-progress/farmer',
                { farmerId }
            );
            setWorkProgress(response.data);
        } catch (err) {
            console.error('Error fetching work progress:', err);
            setError('Error fetching work progress');
        }
    };

    useEffect(() => {
        fetchWorkProgress();
    }, [farmerId]);

    return (
        <div className="work-progress-container">
            <h2>Work Progress for Farmer</h2>

            {error && <div className="error">{error}</div>}

            <table className="work-progress-table">
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Completion Date</th>
                    </tr>
                </thead>
                <tbody>
                    {workProgress.length > 0 ? (
                        workProgress.map((progress) => (
                            <tr key={progress._id}>
                                <td>{progress.task}</td>
                                <td>{progress.status}</td>
                                <td>{progress.completionDate}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No work progress available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default WorkProgressByFarmer;
