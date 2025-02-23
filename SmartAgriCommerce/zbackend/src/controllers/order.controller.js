const Order = require('../models/Order');

// Create a new order
// exports.createOrder = async (req, res) => {
//     try {
//         const { buyerId, farmerId, products, totalPrice } = req.body;

//         if (!buyerId || !farmerId || !products || !totalPrice) {
//             return res.status(400).json({ error: 'Please provide all required fields' });
//         }

//         const newOrder = new Order({
//             buyerId,
//             farmerId,
//             products,
//             totalPrice
//         });

//         await newOrder.save();
//         res.status(201).json({ message: 'Order created successfully', order: newOrder });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


// const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { buyerId, farmerId, products, totalPrice } = req.body;

        if (!buyerId || !farmerId || !products || !totalPrice) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // Check if the products are in stock
        for (let productItem of products) {
            const product = await Product.findById(productItem.productId);
            if (!product) {
                return res.status(404).json({ error: `Product with ID ${productItem.productId} not found` });
            }

            // Check if there is enough stock
            if (product.stock < productItem.quantity) {
                return res.status(400).json({
                    error: `Not enough stock for product ${product.name}. Only ${product.stock} left in stock.`
                });
            }
        }

        // Create a new order and reduce the stock
        const newOrder = new Order({
            buyerId,
            farmerId,
            products,
            totalPrice
        });

        await newOrder.save();

        // Update product stock and status
        for (let productItem of products) {
            const product = await Product.findById(productItem.productId);
            product.stock -= productItem.quantity;

            // If the product is out of stock, set its status to "Out of Stock"
            if (product.stock === 0) {
                product.status = 'Out of Stock';
            }

            await product.save();
        }

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('buyerId farmerId products.productId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('buyerId farmerId products.productId');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update order status (e.g., pending -> shipped -> delivered -> cancelled)
exports.updateOrderStatus = async (req, res) => {
  const { newStatus } = req.body;
  
  // Validate the newStatus
  const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid status' });
  }

  try {
      const order = await Order.findById(req.params.id);
      if (!order) {
          return res.status(404).json({ error: 'Order not found' });
      }

      order.status = newStatus;
      await order.save();

      res.json({
          message: 'Order status updated successfully',
          order
      });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};


// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
