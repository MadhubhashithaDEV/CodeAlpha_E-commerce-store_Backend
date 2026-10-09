const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

const seedProducts = [
  {
    name: "Classic Italian Linen Shirt",
    slug: "classic-italian-linen-shirt",
    description: "Tailored from 100% premium Italian linen, this lightweight button-up shirt delivers effortless sophistication for modern warm-weather styling.",
    price: 6490,
    originalPrice: 8990,
    category: "Shirts",
    gender: "Men",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["White", "Sky Blue", "Beige"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 25,
    rating: 4.8,
    reviewsCount: 34,
    featured: true,
    bestseller: true
  },
  {
    name: "Minimalist Supima Crewneck T-Shirt",
    slug: "minimalist-supima-crewneck-tshirt",
    description: "Ultra-soft 100% American Supima cotton crewneck t-shirt with reinforced double-stitched collar and luxurious drape.",
    price: 2990,
    originalPrice: 3990,
    category: "T-Shirts",
    gender: "Men",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Black", "Charcoal", "White", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    stock: 40,
    rating: 4.9,
    reviewsCount: 88,
    featured: true,
    bestseller: true
  },
  {
    name: "Velora Signature Leather Moto Jacket",
    slug: "velora-signature-leather-moto-jacket",
    description: "Crafted from supple full-grain lambskin leather with custom matte silver hardware and quilted interior lining.",
    price: 24990,
    originalPrice: 29990,
    category: "Jackets",
    gender: "Men",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Black", "Dark Brown"],
    sizes: ["M", "L", "XL"],
    stock: 8,
    rating: 5.0,
    reviewsCount: 19,
    featured: true,
    bestseller: false
  },
  {
    name: "Slim Fit Selvedge Denim Jeans",
    slug: "slim-fit-selvedge-denim-jeans",
    description: "Authentic 14oz Japanese selvedge denim woven on vintage shuttle looms, featuring classic 5-pocket construction.",
    price: 8990,
    originalPrice: 11990,
    category: "Jeans",
    gender: "Men",
    images: [
      "https://images.unsplash.com/photo-1542272604-780c36856d60?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Indigo Wash", "Raw Black", "Vintage Blue"],
    sizes: ["S", "M", "L", "XL"],
    stock: 30,
    rating: 4.7,
    reviewsCount: 52,
    featured: false,
    bestseller: true
  },
  {
    name: "Silk Satin Midi Evening Dress",
    slug: "silk-satin-midi-evening-dress",
    description: "Graceful cowl neck bias-cut midi dress fashioned from glossy Mulberry silk satin with adjustable delicate straps.",
    price: 12990,
    originalPrice: 16990,
    category: "Dresses",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Emerald Green", "Champagne Gold", "Midnight Black"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    rating: 4.9,
    reviewsCount: 41,
    featured: true,
    bestseller: true
  },
  {
    name: "Oversized Cashmere Blend Trench Coat",
    slug: "oversized-cashmere-blend-trench-coat",
    description: "Structured double-breasted outerwear combining warm Mongolian cashmere and wool with storm flap detailing.",
    price: 28990,
    originalPrice: 34990,
    category: "Jackets",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Camel", "Soft Ivory", "Charcoal"],
    sizes: ["S", "M", "L"],
    stock: 10,
    rating: 4.8,
    reviewsCount: 27,
    featured: true,
    bestseller: false
  },
  {
    name: "High-Waisted Wide Leg Tailored Trousers",
    slug: "high-waisted-wide-leg-tailored-trousers",
    description: "Contemporary wide-leg silhouette featuring deep front pleats, high rise waistline and fluid drape.",
    price: 7490,
    originalPrice: 9490,
    category: "Jeans",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Black", "Cream", "Taupe"],
    sizes: ["S", "M", "L", "XL"],
    stock: 22,
    rating: 4.6,
    reviewsCount: 39,
    featured: false,
    bestseller: true
  },
  {
    name: "Ribbed Organic Knit Crop Top",
    slug: "ribbed-organic-knit-crop-top",
    description: "Breathable stretch organic cotton ribbed knit fitted top designed for versatile layering.",
    price: 2490,
    originalPrice: 3290,
    category: "Tops",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Off White", "Black", "Sage Green"],
    sizes: ["S", "M", "L"],
    stock: 35,
    rating: 4.7,
    reviewsCount: 65,
    featured: false,
    bestseller: false
  },
  {
    name: "Structured Cotton Poplin Oxford Shirt",
    slug: "structured-cotton-poplin-oxford-shirt",
    description: "Crisp 100% Egyptian cotton poplin smart shirt with button-down collar and polished mother-of-pearl buttons.",
    price: 5490,
    originalPrice: 6990,
    category: "Shirts",
    gender: "Men",
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Light Blue", "Pure White", "Pink Striped"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 18,
    rating: 4.8,
    reviewsCount: 45,
    featured: false,
    bestseller: true
  },
  {
    name: "Pleated A-Line Satin Skirt",
    slug: "pleated-a-line-satin-skirt",
    description: "Shimmering knife-pleated midi skirt featuring an elasticated high waistline and romantic flowing movement.",
    price: 5990,
    originalPrice: 7990,
    category: "Skirts",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Bronze", "Blush Pink", "Black"],
    sizes: ["S", "M", "L"],
    stock: 14,
    rating: 4.6,
    reviewsCount: 29,
    featured: false,
    bestseller: false
  },
  {
    name: "Urban Utility Cargo Shorts",
    slug: "urban-utility-cargo-shorts",
    description: "Heavyweight stretch cotton twill shorts equipped with functional side flap pockets and reinforced seat stitching.",
    price: 3990,
    originalPrice: 4990,
    category: "Shorts",
    gender: "Men",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Khaki", "Olive Green", "Matte Black"],
    sizes: ["S", "M", "L", "XL"],
    stock: 28,
    rating: 4.5,
    reviewsCount: 31,
    featured: false,
    bestseller: false
  },
  {
    name: "Bohemian Floral Tiered Maxi Dress",
    slug: "bohemian-floral-tiered-maxi-dress",
    description: "Lightweight viscose chiffon maxi dress printed with delicate botanical florals, featuring a elastic cinch waist.",
    price: 8490,
    originalPrice: 10990,
    category: "Dresses",
    gender: "Women",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&auto=format&fit=crop&q=80"
    ],
    colors: ["Floral Navy", "Terracotta"],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    rating: 4.9,
    reviewsCount: 38,
    featured: true,
    bestseller: false
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing product and user seed data...');
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Seeding initial admin and test users...');
    const adminUser = await User.create({
      name: 'VELORA Admin',
      email: 'admin@velora.com',
      password: 'admin123password',
      phone: '+92 300 1234567',
      address: {
        street: '100 Luxury Boulevard',
        city: 'Lahore',
        district: 'Gulberg III',
        postalCode: '54000',
        country: 'Pakistan'
      },
      role: 'admin'
    });

    const testUser = await User.create({
      name: 'Ahmad Khan',
      email: 'ahmad@example.com',
      password: 'user123password',
      phone: '+92 321 9876543',
      address: {
        street: 'House #45, Block B, DHA Phase 5',
        city: 'Karachi',
        district: 'Clifton',
        postalCode: '75500',
        country: 'Pakistan'
      },
      role: 'user'
    });

    console.log(`Created Admin: ${adminUser.email}`);
    console.log(`Created User: ${testUser.email}`);

    console.log('Seeding product catalog...');
    const createdProducts = await Product.insertMany(seedProducts);
    console.log(`Successfully seeded ${createdProducts.length} clothing products into MongoDB.`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
