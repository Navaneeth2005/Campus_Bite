const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.menuItem').isMongoId().withMessage('Invalid menu item id'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  validate,
  orderController.createOrder
);

router.get('/', orderController.getMyOrders);
router.get('/all', authorize('admin'), orderController.getAllOrders);
router.get('/:id', orderController.getOrder);

router.put(
  '/:id/status',
  authorize('admin'),
  [body('status').isIn(['pending', 'preparing', 'delivered', 'cancelled']).withMessage('Invalid order status')],
  validate,
  orderController.updateOrderStatus
);

module.exports = router;
