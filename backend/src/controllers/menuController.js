const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

// @GET /api/menu
exports.getMenuItems = async (req, res) => {
  try {
    const { category, search, special, bestseller, available, page = 1, limit = 100 } = req.query;
    const filter = {};

    if (category && category !== 'all') filter.categorySlug = category;
    if (special === 'true') filter.isSpecial = true;
    if (bestseller === 'true') filter.isBestseller = true;
    if (available === 'true') filter.isAvailable = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      MenuItem.find(filter).populate('category', 'name slug icon').sort({ categorySlug: 1, name: 1 }).skip(skip).limit(parseInt(limit)),
      MenuItem.countDocuments(filter),
    ]);

    res.json({ success: true, data: items, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/menu/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/menu/:id
exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category');
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/menu (admin)
exports.createMenuItem = async (req, res) => {
  try {
    const { name, categorySlug, price, description, image, isAvailable, isSpecial, isBestseller, tags, preparationTime } = req.body;
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const item = await MenuItem.create({
      name, category: category._id, categorySlug, price, description, image: image || '',
      isAvailable, isSpecial, isBestseller, tags, preparationTime,
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/menu/:id (admin)
exports.updateMenuItem = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.categorySlug) {
      const category = await Category.findOne({ slug: updates.categorySlug });
      if (category) updates.category = category._id;
    }
    const item = await MenuItem.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/menu/:id (admin)
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PATCH /api/menu/:id/toggle (admin)
exports.toggleMenuItem = async (req, res) => {
  try {
    const { field } = req.body; // isAvailable, isSpecial, isBestseller
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (['isAvailable', 'isSpecial', 'isBestseller'].includes(field)) {
      item[field] = !item[field];
      await item.save();
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/menu/categories (admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, icon, displayOrder } = req.body;
    const category = await Category.create({ name, slug, icon, displayOrder });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
