import { Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "../pages/LandingPage/LandingPage";
import Signup from "../components/Auth/Signup/Signup";
import Login from "../components/Auth/Login/Login";
import FarmerDashboard from "../components/Dashboard/FarmerDashboard";
import ApplicationsList from "../components/EmployeeManagement/Dashboard/JobApplications/ApplicationsList";
import FarmerEmpNavigation from "../components/EmployeeManagement/FarmerEmpNavigation";
import PaymentProcess from "../components/EmployeeManagement/Dashboard/PaymentProcess/PaymentProcess";
import PostJob from "../components/EmployeeManagement/Dashboard/PostJob/PostJob";
import AvailableJobs from "../components/Dashboard/WorkerDashboard/AvailableJobs";
import AppliedJobs from "../components/Dashboard/WorkerDashboard/AppliedJobs";
import PaymentStatus from "../components/Dashboard/WorkerDashboard/PaymentStatus";
import WorkerDashboard from "../components/Dashboard/WorkerDashboard/WorkerDashboard";
import WorkerNavigation from "../components/Dashboard/WorkerDashboard/WorkerNavigation";
import WorkProgressByFarmer from "../components/EmployeeManagement/Dashboard/SlotAllotment/WorkProgressByFarmer";
import WorkProgressByWorker from "../components/Dashboard/WorkerDashboard/WorkProgressByWorker";

/* Layout for Farmer Employee Management */
const FarmerEmpLayout = () => {
    const [farmerId, setFarmerId] = useState(null);

    useEffect(() => {
        const storedFarmerId = localStorage.getItem("farmerId");
        if (storedFarmerId) {
            setFarmerId(storedFarmerId);
        } else {
            console.warn("Farmer ID is missing. Please log in again.");
        }
    }, []);

    return (
        <>
            <FarmerEmpNavigation />
            <Outlet context={{ farmerId }} />
        </>
    );
};

/* Layout for Worker Dashboard */
const WorkerLayout = () => {
    const [workerId, setWorkerId] = useState(null);

    useEffect(() => {
        const storedWorkerId = localStorage.getItem("workerId");
        if (storedWorkerId) {
            setWorkerId(storedWorkerId);
        } else {
            console.warn("Worker ID is missing. Please log in again.");
        }
    }, []);

    return (
        <>
            <WorkerNavigation />
            <Outlet context={{ workerId }} />
        </>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Farmer Dashboard */}
            <Route path="/dashboard" element={<FarmerDashboard />} />

            {/* Worker Dashboard */}
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />

            {/* Farmer Employee Management Routes */}
            <Route path="/recruit-management" element={<FarmerEmpLayout />}>
                <Route path="application" element={<ApplicationsList />} />
                <Route path="workprogress" element={<WorkProgressByFarmer />} />
                <Route path="payment-process" element={<PaymentProcess />} />
                <Route path="post-job" element={<PostJob />} />
            </Route>

            {/* Worker Dashboard Routes */}
            <Route path="/worker-dashboard" element={<WorkerLayout />}>
                <Route path="jobs" element={<AvailableJobs />} />
                <Route path="applied-jobs" element={<AppliedJobs />} />
                <Route path="accepted-jobs" element={<WorkProgressByWorker />} />
                <Route path="payments" element={<PaymentStatus />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
