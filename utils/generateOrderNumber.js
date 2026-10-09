const Order = require('../models/Order');

const generateOrderNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Order.countDocuments();
  const nextNum = (count + 1).toString().padStart(6, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  
  // Example: VEL-2026-000001 or fallback unique
  const orderNum = `VEL-${year}-${nextNum}`;
  
  // Check if unique just in case
  const exists = await Order.findOne({ orderNumber: orderNum });
  if (exists) {
    return `VEL-${year}-${nextNum}${randomSuffix}`;
  }
  
  return orderNum;
};

module.exports = generateOrderNumber;
