const Product = require('../models/Product');

// @desc    Get all products with search, filter, sort
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      gender,
      size,
      color,
      minPrice,
      maxPrice,
      sort,
      featured,
      bestseller
    } = req.query;

    const query = {};

    // Search keyword
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Gender filter
    if (gender && gender !== 'All') {
      query.gender = gender;
    }

    // Size filter
    if (size) {
      query.sizes = size;
    }

    // Color filter
    if (color) {
      query.colors = { $regex: new RegExp(color, 'i') };
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured / Bestseller flags
    if (featured === 'true') query.featured = true;
    if (bestseller === 'true') query.bestseller = true;

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'popularity') {
      sortOptions = { rating: -1, reviewsCount: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product categories list
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      gender,
      images,
      colors,
      sizes,
      stock,
      featured,
      bestseller
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = new Product({
      name,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description,
      price,
      originalPrice: originalPrice || price,
      category,
      gender: gender || 'Unisex',
      images: images || ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
      colors: colors || ['Black', 'White'],
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      stock: stock !== undefined ? stock : 10,
      featured: !!featured,
      bestseller: !!bestseller
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
};
