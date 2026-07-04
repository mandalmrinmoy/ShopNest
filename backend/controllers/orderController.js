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

    let grandTotal = 0;

    // Check stock & update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);

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

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();

      // Calculate item total
      item.totalPrice = product.price * item.quantity;

      grandTotal += item.totalPrice;
    }

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

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Order Placed Successfully",
      text: `
Hello ${user.name},

Your order has been placed successfully.

Order ID: ${createdOrder._id}
Payment ID: ${paymentId}
Total Amount: ₹${grandTotal}

Status: Pending

Thank you for shopping with us.
      `,
    });

    res.status(201).json(createdOrder);
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

    // Send status update email
    await sendEmail({
      to: order.user.email,
      subject: "Order Status Updated",
      text: `Hello ${order.user.name},
            Your order status has been updated.Order ID: ${order._id}
            New Status: ${order.status}Thank you for shopping with us.`,
    });

    res.status(200).json(updatedOrder);
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
