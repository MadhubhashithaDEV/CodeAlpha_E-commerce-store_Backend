const Order = require('../models/Order');
const Product = require('../models/Product');
const generateOrderNumber = require('../utils/generateOrderNumber');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. Cannot place an order.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
      return res.status(400).json({ success: false, message: 'Please provide complete shipping address details.' });
    }

    const processedItems = [];
    let calculatedSubtotal = 0;

    // Verify each product, price, size, and stock from database
    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId || item.product} no longer exists.`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`
        });
      }

      if (!item.size) {
        return res.status(400).json({
          success: false,
          message: `Size selection is required for "${product.name}".`
        });
      }

      const itemSubtotal = product.price * item.quantity;
      calculatedSubtotal += itemSubtotal;

      processedItems.push({
        product: product._id,
        productName: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color || product.colors[0] || 'Default'
      });
    }

    // Shipping calculation: Free shipping over Rs 10,000, else Rs 500
    const shippingCost = calculatedSubtotal >= 10000 ? 0 : 500;
    const discount = 0;
    const calculatedTotal = calculatedSubtotal + shippingCost - discount;

    const orderNum = await generateOrderNumber();

    const order = new Order({
      orderNumber: orderNum,
      user: req.user._id,
      items: processedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      subtotal: calculatedSubtotal,
      shippingCost,
      discount,
      total: calculatedTotal,
      status: 'Confirmed'
    });

    const createdOrder = await order.save();

    // Reduce stock for ordered items
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
