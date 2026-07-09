const Order = require("../model/Order");
const Product = require("../model/Product");
const User = require("../model/User");
const sendEmail = require("../utils/sendEmail");

// Create Order
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentId } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    // Fetch all needed products in a single query
    const productIds = orderItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Build a quick lookup map
    const productMap = {};
    products.forEach((p) => (productMap[p._id.toString()] = p));

    let grandTotal = 0;
    const bulkStockUpdates = [];

    for (const item of orderItems) {
      const product = productMap[item.productId];

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Calculate item total
      item.totalPrice = product.price * item.quantity;
      grandTotal += item.totalPrice;

      bulkStockUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { stock: -item.quantity } },
        },
      });
    }

    // Apply all stock updates in a single batched request
    await Product.bulkWrite(bulkStockUpdates);

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentId,
      totalPrice: grandTotal,
      status: "Pending",
    });

    const createdOrder = await order.save();

    // Get user
    const user = await User.findById(req.user._id);

    // Respond immediately — don't make the client wait on email
    res.status(201).json(createdOrder);

    // Send email in background
    sendEmail(
      user.email,
      "Order Placed Successfully",
      `Hello ${user.name}, Your order has been placed successfully.
        Order ID: ${createdOrder._id}
        Payment ID: ${paymentId}
        Total Amount: ₹${grandTotal}
        
        Status: Pending

        Thank you for shopping with us.
`,
    ).catch((err) => console.error("Order email failed:", err.message));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all orders (Admin)
const getOrder = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.productId");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get logged in user orders
const getOrderById = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).populate("orderItems.productId");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status || order.status;

    const updatedOrder = await order.save();

    // Respond immediately
    res.status(200).json(updatedOrder);

    // Send status update email in background
    sendEmail(
      order.user.email,
      "Order Status Updated",
      `Hello ${order.user.name},Your order status has been updated.
      Order ID: ${order._id} New Status: ${order.status}
      Thank you for shopping with us.`,
    ).catch((err) => console.error("Status update email failed:", err.message));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrderById,
  updateOrderStatus,
};