import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WorkProgressByWorker.css"; // Add your styles here

const WorkProgressForWorker = () => {
    const [workProgress, setWorkProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [workerId] = useState(localStorage.getItem("workerId") || null);

    useEffect(() => {
        const fetchWorkProgress = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/workprogress/work-progress/worker/${workerId}`);
                setWorkProgress(response.data); // Assuming response.data is the array of work progress
            } catch (err) {
                setError("Failed to load work progress");
                console.error("Error fetching worker work progress:", err);
            } finally {
                setLoading(false);
            }
        };

        if (workerId) {
            fetchWorkProgress();
        } else {
            setError("Worker ID not found in localStorage");
            setLoading(false);
        }
    }, [workerId]);

    const handleUpdateStatus = async (progressId, newStatus) => {
        try {
            // Assuming `progressId` is unique for each work progress record
            const response = await axios.patch(
                `http://localhost:5000/api/workprogress/update/${progressId}`,
                { workerStatus: newStatus }
            );
            // Update the status in the frontend after the successful request
            setWorkProgress((prevState) =>
                prevState.map((progress) =>
                    progress._id === progressId ? { ...progress, workerStatus: newStatus } : progress
                )
            );
            alert("Status updated successfully");
        } catch (err) {
            setError("Failed to update status");
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="work-progress-container">
            <h2>My Work Progress</h2>

            {loading ? (
                <p>Loading work progress...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : workProgress.length === 0 ? (
                <p>No work progress found.</p>
            ) : (
                <table className="work-progress-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Farmer Name</th>
                            <th>Status</th>
                            <th>Payment Status</th>
                            <th>Farmer Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workProgress.map((progress) => (
                            <tr key={progress._id}>
                                <td>{progress.jobId?.title || "N/A"}</td>
                                <td>{progress.farmerId?.name || "N/A"}</td>
                                <td>
                                    {progress.workerStatus}{" "}
                                    <button
                                        onClick={() => handleUpdateStatus(progress._id, "Completed")}
                                    >
                                        Mark as Completed
                                    </button>
                                </td>
                                <td>{progress.paymentStatus}</td>
                                <td>{progress.farmerStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default WorkProgressForWorker;
