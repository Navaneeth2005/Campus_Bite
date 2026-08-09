/**
 * Seeds the database with menu items and a default admin account.
 *
 * Usage:
 *   npm run seed           # add menu items + admin (idempotent)
 *   npm run seed -- --reset  # wipe menu collection first, then reseed
 */
require('dotenv').config();
const connectDB = require('../src/config/db');
const MenuItem = require('../src/models/MenuItem');
const User = require('../src/models/User');
const Order = require('../src/models/Order');

// Menu data migrated from the original static site (menu-cart.js)
const menuSeed = [
  // Desserts
  { name: 'Chocolate Brownie', price: 80, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&q=80', description: 'Rich chocolate brownie with ice cream', category: 'desserts' },
  { name: 'Ice Cream Sundae', price: 100, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80', description: 'Vanilla ice cream with toppings', category: 'desserts' },
  { name: 'Chocolate Cake', price: 120, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80', description: 'Layered chocolate cake slice', category: 'desserts' },

  // Beverages
  { name: 'Cold Coffee', price: 60, image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&q=80', description: 'Chilled coffee with ice cream', category: 'beverages' },
  { name: 'Green Tea', price: 30, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&q=80', description: 'Healthy green tea', category: 'beverages' },
  { name: 'Cappuccino', price: 80, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80', description: 'Classic Italian coffee', category: 'beverages' },

  // Bakery
  { name: 'Croissant', price: 60, image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=500&q=80', description: 'Buttery French pastry', category: 'bakers' },
  { name: 'Chocolate Muffin', price: 50, image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&q=80', description: 'Moist chocolate muffin', category: 'bakers' },
  { name: 'Sandwich', price: 90, image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=500&q=80', description: 'Veg grilled sandwich', category: 'bakers' },
  { name: 'Puff Pastry', price: 40, image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=500&q=80', description: 'Crispy vegetable puff', category: 'bakers' },
  { name: 'Pizza Slice', price: 100, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80', description: 'Cheesy pizza slice', category: 'bakers' },

  // Chinese
  { name: 'Veg Fried Rice', price: 120, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80', description: 'Stir-fried rice with vegetables', category: 'chinese' },
  { name: 'Hakka Noodles', price: 130, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80', description: 'Indo-Chinese noodles', category: 'chinese' },
  { name: 'Veg Momos', price: 80, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=80', description: 'Steamed vegetable dumplings', category: 'chinese' },

  // Juices
  { name: 'Orange Juice', price: 60, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80', description: 'Freshly squeezed orange juice', category: 'juices' },
  { name: 'Mango Juice', price: 50, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&q=80', description: 'Refreshing mango juice', category: 'juices' },

  // Continental
  { name: 'Pasta Alfredo', price: 180, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&q=80', description: 'Creamy white sauce pasta', category: 'continental' },
  { name: 'Veg Burger', price: 120, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&q=80', description: 'Loaded vegetable burger', category: 'continental' },
  { name: 'French Fries', price: 80, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80', description: 'Crispy golden fries', category: 'continental' },
  { name: 'Grilled Sandwich', price: 100, image: 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?w=500&q=80', description: 'Grilled cheese sandwich', category: 'continental' },
  { name: 'Nachos', price: 140, image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=500&q=80', description: 'Corn chips with cheese dip', category: 'continental' },
  { name: 'Mac and Cheese', price: 160, image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=500&q=80', description: 'Macaroni in cheese sauce', category: 'continental' },

  // North Indian
  { name: 'Paneer Butter Masala', price: 180, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80', description: 'Paneer in rich tomato gravy', category: 'north-indian' },
  { name: 'Dal Makhani', price: 140, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80', description: 'Creamy black lentil curry', category: 'north-indian' },

  // South Indian
  { name: 'Masala Dosa', price: 80, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80', description: 'Crispy dosa with potato filling', category: 'south-indian' },
  { name: 'Idli Sambar', price: 50, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&q=80', description: 'Steamed rice cakes with lentil soup', category: 'south-indian' },
  { name: 'Veg Biryani', price: 200, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80', description: 'Aromatic rice with vegetables', category: 'south-indian' },

  // Japanese
  { name: 'Veg Sushi Roll', price: 220, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&q=80', description: 'Fresh vegetable sushi', category: 'japanese' },
  { name: 'Tempura', price: 180, image: 'https://images.unsplash.com/photo-1588347818036-b6e2c6273f19?w=500&q=80', description: 'Battered fried vegetables', category: 'japanese' },
  { name: 'Ramen Noodles', price: 200, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80', description: 'Japanese noodle soup', category: 'japanese' },

  // World Cuisine
  { name: 'Tacos', price: 150, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80', description: 'Mexican street food', category: 'other' },
  { name: 'Falafel Wrap', price: 130, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&q=80', description: 'Middle Eastern wrap', category: 'other' },
  { name: 'Thai Curry', price: 180, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&q=80', description: 'Coconut-based curry', category: 'other' }
];

const ADMIN = {
  name: 'Campus Bite Admin',
  email: 'admin@campusbite.com',
  college: 'Mallareddy Engineering College',
  password: 'admin123',
  role: 'admin'
};

async function seed() {
  await connectDB();

  const reset = process.argv.includes('--reset');
  const resetAll = process.argv.includes('--reset-all');
  if (resetAll) {
    await Promise.all([MenuItem.deleteMany({}), Order.deleteMany({}), User.deleteMany({})]);
    console.log('Cleared menu, orders and users');
  } else if (reset) {
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
  }

  // Menu items (skip ones already present to keep it idempotent)
  const existingNames = await MenuItem.distinct('name');
  const toInsert = menuSeed.filter((item) => !existingNames.includes(item.name));
  if (toInsert.length) {
    await MenuItem.insertMany(toInsert);
  }
  console.log(`Menu: ${menuSeed.length} items total, ${toInsert.length} inserted`);

  // Admin user
  let admin = await User.findOne({ email: ADMIN.email });
  if (!admin) {
    admin = await User.create(ADMIN);
    console.log(`Admin created: ${ADMIN.email} / ${ADMIN.password}`);
  } else {
    console.log(`Admin already exists: ${ADMIN.email}`);
  }

  const mongoose = require('mongoose');
  await mongoose.disconnect();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
