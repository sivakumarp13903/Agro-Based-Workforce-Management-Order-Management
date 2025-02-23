const mongoose = require("mongoose");
require("./Worker");
require("./Farmer");

const PaymentSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["GPay", "Cash"], required: true },
    gpayNumber: { type: String, required: function () { return this.paymentMethod === "GPay"; } },
    status: { type: String, enum: ["Pending", "Sent", "Confirmed"], default: "Pending" },
    paymentDate: { type: Date, default: Date.now },
    workerConfirmation: { type: Boolean, default: false },
    confirmationDate: { type: Date }
});

module.exports = mongoose.model("Payment", PaymentSchema);
