const MenuItem = require('../models/MenuItem');
const AppError = require('../utils/AppError');

// GET /api/menu?category=desserts&q=brownie&available=true
const getMenuItems = async (req, res, next) => {
  try {
    const { category, q, available } = req.query;
    const filter = {};

    if (category) filter.category = category.toLowerCase();
    // Explicit true/false filter wins; otherwise public users only see available items.
    if (available === 'true' || available === 'false') {
      filter.available = available === 'true';
    } else if (req.user?.role !== 'admin') {
      filter.available = true;
    }

    let items;
    if (q && q.trim()) {
      items = await MenuItem.find(
        { $text: { $search: q.trim() }, ...filter },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .collation({ locale: 'en', strength: 2 });
    } else {
      items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    }

    res.status(200).json({ success: true, count: items.length, items });
  } catch (error) {
    next(error);
  }
};

const getMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return next(new AppError('Menu item not found', 404));
    }
    res.status(200).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create({
      name: req.body.name,
      description: req.body.description || '',
      price: req.body.price,
      category: req.body.category.toLowerCase(),
      image: req.body.image || '',
      available: req.body.available !== undefined ? req.body.available : true
    });
    res.status(201).json({ success: true, message: 'Menu item added', item });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(req.body.category ? { category: req.body.category.toLowerCase() } : {})
      },
      { new: true, runValidators: true }
    );
    if (!item) {
      return next(new AppError('Menu item not found', 404));
    }
    res.status(200).json({ success: true, message: 'Menu item updated', item });
  } catch (error) {
    next(error);
  }
};

// PUT /api/menu/:id/availability  { available: boolean }
const toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { available: req.body.available },
      { new: true, runValidators: true }
    );
    if (!item) {
      return next(new AppError('Menu item not found', 404));
    }
    res.status(200).json({
      success: true,
      message: `Item is now ${item.available ? 'available' : 'unavailable'}`,
      item
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return next(new AppError('Menu item not found', 404));
    }
    res.status(200).json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem
};
