const express = require('express');
const { body } = require('express-validator');
const menuController = require('../controllers/menu.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Public
router.get('/', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItem);

// Admin only
router.use(authenticate, authorize('admin'));

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').trim().isLength({ min: 2, max: 50 }).withMessage('Category is required'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
    body('image').optional().trim().isURL({ require_protocol: true }).withMessage('Image must be a valid URL')
  ],
  validate,
  menuController.createMenuItem
);

router.put(
  '/:id',
  [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('price').optional().isFloat({ min: 0 }),
    body('category').optional().trim().isLength({ min: 2, max: 50 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('available').optional().isBoolean(),
    body('image').optional().trim().isURL({ require_protocol: true })
  ],
  validate,
  menuController.updateMenuItem
);

router.put(
  '/:id/availability',
  [body('available').isBoolean().withMessage('available must be a boolean')],
  validate,
  menuController.toggleAvailability
);

router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
