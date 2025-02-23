const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Create Order
router.post('/create', orderController.createOrder);

// Get All Orders
router.get('/', orderController.getAllOrders);

// Get Order by ID
router.get('/:id', orderController.getOrderById);

// Update Order Status
router.put('/:id', orderController.updateOrderStatus);

// Delete Order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
