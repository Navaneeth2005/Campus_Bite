const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const AppError = require('../utils/AppError');

const ORDER_STATUSES = ['pending', 'preparing', 'delivered', 'cancelled'];

// POST /api/orders  { items: [{ menuItem, quantity }] }
// Prices are always taken from the database - never trusted from the client.
const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return next(new AppError('Order must contain at least one item', 400));
    }

    const ids = items.map((i) => i.menuItem);
    const menuItems = await MenuItem.find({ _id: { $in: ids } });

    if (menuItems.length !== new Set(ids.map(String)).size) {
      return next(new AppError('One or more menu items do not exist', 400));
    }

    const priceMap = new Map(menuItems.map((m) => [String(m._id), m]));

    const orderItems = items.map(({ menuItem, quantity }) => {
      const menu = priceMap.get(String(menuItem));
      if (!menu) {
        throw new AppError('One or more menu items do not exist', 400);
      }
      if (!menu.available) {
        throw new AppError(`"${menu.name}" is currently unavailable`, 400);
      }
      return {
        menuItem: menu._id,
        name: menu.name,
        price: menu.price,
        quantity: quantity
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalAmount
    });

    res.status(201).json({ success: true, message: 'Order placed', order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders  (the logged-in user's orders)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('user', 'name email college')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email college');
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    const isOwner = String(order.user._id) === String(req.userId);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return next(new AppError('You do not have permission to view this order', 403));
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/all  (admin)  ?status=pending
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ORDER_STATUSES.includes(status)) filter.status = status;

    const orders = await Order.find(filter)
      .populate('user', 'name email college')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status  { status }
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return next(new AppError('Invalid order status', 400));
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
