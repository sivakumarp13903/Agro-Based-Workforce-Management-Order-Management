const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const verifyToken = require("../middleware/auth"); 
const roleCheck = require("../middleware/roleCheck");


router.post("/create", verifyToken, roleCheck(["farmer"]), paymentController.createPayment);

// 🔹 Route to get all payments (Admin Only)
router.get("/all", verifyToken, roleCheck(["admin"]), paymentController.getAllPayments);


router.get("/farmer", verifyToken, roleCheck(["farmer"]), paymentController.getFarmerPayments);


router.get("/worker", verifyToken, roleCheck(["worker"]), paymentController.getWorkerPayments);

// 🔹 Route to confirm payment (Worker Only)
router.put("/confirm/:paymentId", verifyToken, roleCheck(["worker"]), paymentController.confirmPayment);

module.exports = router;
