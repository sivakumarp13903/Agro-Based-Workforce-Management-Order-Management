import React, { useState, useEffect } from "react";
import { postJob, getJobs } from "../../../../services/authService"; // Import getJobs function
import { useNavigate } from "react-router-dom";

const PostJob = () => {
    const navigate = useNavigate();

    // State for form inputs
    const [job, setJob] = useState({
        title: "",
        description: "",
        duration: "",
        salary: "",
        location: "",
    });

    // State for loading, error messages, and posted jobs
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [jobs, setJobs] = useState([]); // Store already posted jobs

    // Check if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to post a job!");
            navigate("/login");
        }
    }, [navigate]);

    // Fetch posted jobs from backend
    // useEffect(() => {
    //     const fetchJobs = async () => {
    //         try {
    //             const response = await getJobs(); // Fetch jobs from API
    //             setJobs(response.data);
    //         } catch (err) {
    //             console.error("❌ Failed to fetch jobs:", err);
    //             setError("Failed to load jobs.");
    //         }
    //     };
    //     fetchJobs();
    // }, []);

    // Handle input change
    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!job.title || !job.description || !job.duration || !job.salary || !job.location) {
            setError("All fields are required!");
            setLoading(false);
            return;
        }

        try {
            console.log("📝 Sending Job Data:", job);
            await postJob(job);
            alert("✅ Job posted successfully!");
            setJob({ title: "", description: "", duration: "", salary: "", location: "" });

            // Refresh jobs list after posting
            const updatedJobs = await getJobs();
            setJobs(updatedJobs.data);
        } catch (error) {
            console.error("❌ Job Posting Failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to post job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-job-container">
            <h2>Post a Job</h2>
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Job Description" value={job.description} onChange={handleChange} required />
                <input type="text" name="duration" placeholder="Duration (e.g., 2 weeks)" value={job.duration} onChange={handleChange} required />
                <input type="text" name="salary" placeholder="Salary (e.g., ₹500/day)" value={job.salary} onChange={handleChange} required />
                <input type="text" name="location" placeholder="Work Location" value={job.location} onChange={handleChange} required />
                
                <button type="submit" disabled={loading}>
                    {loading ? "Posting..." : "Post Job"}
                </button>
            </form>

            {/* <h2>Posted Jobs</h2>
            <ul className="job-list">
                {jobs.length === 0 ? (
                    <p>No jobs posted yet.</p>
                ) : (
                    jobs.map((j) => (
                        <li key={j._id} className="job-item">
                            <h3>{j.title}</h3>
                            <p>{j.description}</p>
                            <p><strong>Duration:</strong> {j.duration}</p>
                            <p><strong>Salary:</strong> ₹{j.salary}</p>
                            <p><strong>Location:</strong> {j.location}</p>
                        </li>
                    ))
                )}
            </ul> */}
        </div>
    );
};

export default PostJob;
