const Payment = require("../models/Payment");

// ✅ Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { jobId, workerId, amount, paymentMethod, gpayNumber } = req.body;

        if (paymentMethod === "GPay" && !gpayNumber) {
            return res.status(400).json({ message: "GPay number is required for online payments." });
        }

        const payment = new Payment({
            jobId,
            workerId,
            farmerId: req.user.id, // Get farmer ID from authenticated user
            amount,
            paymentMethod,
            gpayNumber: paymentMethod === "GPay" ? gpayNumber : undefined
        });

        await payment.save();
        res.status(201).json({ message: "Payment initiated successfully.", payment });

    } catch (error) {
        res.status(500).json({ message: "Error processing payment.", error });
    }
};

// ✅ Get all payments (for admin)
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("jobId", "title") // Populate job title
            .populate("workerId", "name email phone") // Populate worker details
            .populate("farmerId", "name email phone"); // Populate farmer details

        res.json(payments);
    } catch (error) {
        console.error("Error retrieving payments:", error);
        res.status(500).json({ message: "Error retrieving payments.", error: error.message });
    }
};

// ✅ Get payments by farmer
exports.getFarmerPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ farmerId: req.user.id }).populate("jobId workerId");
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving payments.", error });
    }
};

// ✅ Get payments by worker
exports.getWorkerPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ workerId: req.user.id }).populate("jobId farmerId");
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving payments.", error });
    }
};

// ✅ Confirm payment received by worker
exports.confirmPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found." });
        }

        if (payment.workerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to confirm this payment." });
        }

        payment.status = "Confirmed";
        payment.workerConfirmation = true;
        payment.confirmationDate = new Date();
        await payment.save();

        res.status(200).json({ message: "Payment confirmed successfully.", payment });

    } catch (error) {
        res.status(500).json({ message: "Error confirming payment.", error });
    }
};
