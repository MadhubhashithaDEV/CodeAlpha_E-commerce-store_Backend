const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database and Auto-seed if empty
connectDB().then(async () => {
  try {
    const Product = require('./models/Product');
    const User = require('./models/User');
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('No products detected in database. Auto-seeding initial catalog and test users...');
      const seedProductsScript = require('./seed/seedProductsHelper');
      await seedProductsScript();
    }
  } catch (err) {
    console.error('Auto-seed check failed:', err.message);
  }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Serve Frontend Static Files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Fallback for HTML page routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const pageFile = req.path.endsWith('.html') || req.path === '/' 
    ? (req.path === '/' ? 'index.html' : req.path)
    : `${req.path}.html`;
    
  res.sendFile(path.join(frontendPath, pageFile), (err) => {
    if (err) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`VELORA Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Frontend accessible at: http://localhost:${PORT}`);
});
