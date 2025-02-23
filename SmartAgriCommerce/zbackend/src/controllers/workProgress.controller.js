const WorkProgress = require('../models/WorkProgress');
const mongoose = require('mongoose');

// ✅ Create Work Progress
exports.createWorkProgress = async (req, res) => {
    try {
        const { jobId, workerId, farmerId } = req.body;

        // Validate input fields
        if (!jobId || !workerId || !farmerId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new work progress entry
        const workProgress = new WorkProgress({ jobId, workerId, farmerId });
        await workProgress.save();

        res.status(201).json({ message: 'Work Progress created successfully', workProgress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update Worker Status
exports.updateWorkerStatus = async (req, res) => {
    try {
        const { workProgressId } = req.params;
        const { workerStatus } = req.body;

        // Validate worker status
        if (!workerStatus) {
            return res.status(400).json({ message: 'Worker status is required' });
        }

        // Find work progress entry
        const workProgress = await WorkProgress.findById(workProgressId);
        if (!workProgress) {
            return res.status(404).json({ message: 'Work Progress not found' });
        }

        // Check if the user is the worker
        if (req.user.id !== workProgress.workerId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this work progress' });
        }

        // Update the worker status
        workProgress.workerStatus = workerStatus;
        await workProgress.save();

        res.status(200).json({ message: 'Worker status updated', workProgress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Farmer Verification of Work
exports.verifyWorkProgress = async (req, res) => {
    try {
        const { workProgressId } = req.params;

        // Find work progress entry
        const workProgress = await WorkProgress.findById(workProgressId);
        if (!workProgress) {
            return res.status(404).json({ message: 'Work Progress not found' });
        }

        // Ensure the requester is the farmer
        if (req.user.id !== workProgress.farmerId.toString()) {
            return res.status(403).json({ message: 'Only the farmer can verify work progress' });
        }

        // Update farmer status to verified
        workProgress.farmerStatus = 'verified';
        await workProgress.save();

        res.status(200).json({ message: 'Work progress verified', workProgress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { workProgressId } = req.params;
        const { paymentStatus } = req.body;

        // Validate payment status
        if (!paymentStatus) {
            return res.status(400).json({ message: 'Payment status is required' });
        }

        // Find work progress entry
        const workProgress = await WorkProgress.findById(workProgressId);
        if (!workProgress) {
            return res.status(404).json({ message: 'Work Progress not found' });
        }

        // Check if the user is the worker
        if (req.user.id !== workProgress.workerId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this payment status' });
        }

        // Update payment status
        workProgress.paymentStatus = paymentStatus;
        await workProgress.save();

        res.status(200).json({ message: 'Payment status updated', workProgress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getWorkProgressByFarmer = async (req, res) => {
    try {
        const farmerId = req.params.farmerId; // Get the farmerId from the route parameters

        // Query the WorkProgress model for the specific farmer's work progress
        const workProgress = await WorkProgress.find({ farmerId });

        if (!workProgress) {
            return res.status(404).json({ message: "No work progress found for this farmer" });
        }

        // Send back the work progress data as a response
        return res.status(200).json(workProgress);
    } catch (error) {
        console.error("Error fetching work progress:", error);
        return res.status(500).json({ message: "Server error while fetching work progress" });
    }
};

// Controller function to update work progress status (if needed)
exports.updateWorkProgressStatus = async (req, res) => {
    try {
        const { applicationId, status } = req.body; // Get the applicationId and status from the request body

        const updatedWorkProgress = await WorkProgress.findByIdAndUpdate(
            applicationId,
            { status: status }, // Update the status field
            { new: true } // Return the updated document
        );

        if (!updatedWorkProgress) {
            return res.status(404).json({ message: "Work progress not found" });
        }

        return res.status(200).json(updatedWorkProgress);
    } catch (error) {
        console.error("Error updating work progress:", error);
        return res.status(500).json({ message: "Server error while updating work progress" });
    }
};

exports.getWorkProgressByWorker = async (req, res) => {
    const { workerId } = req.params; // Get the workerId from the route parameters

    // Ensure the workerId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(400).json({ message: 'Invalid workerId' });
    }

    try {
        const workProgress = await WorkProgress.find({ workerId: new mongoose.Types.ObjectId(workerId) }); // Fix here
        res.json(workProgress);
    } catch (err) {
        console.error("Error fetching work progress:", err);
        res.status(500).json({ message: 'Server error' });
    }
};