const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config(); // Executes from backend root, finds .env naturally

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Restaurant.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('123456', salt);

    const createdUsers = await User.insertMany([
        { name: 'Admin User', email: 'admin@example.com', password: hashPassword, role: 'admin' },
        { name: 'John Customer', email: 'john@example.com', password: hashPassword, role: 'customer' },
        { name: 'Driver Dave', email: 'dave@example.com', password: hashPassword, role: 'driver' }
    ]);

    const adminUser = createdUsers[0]._id;

    const createdCategories = await Category.insertMany([
        { name: 'Burgers', image: 'burger.jpg' },
        { name: 'Pizza', image: 'pizza.jpg' },
        { name: 'Drinks', image: 'drink.jpg' }
    ]);

    const createdProducts = await Product.insertMany([
      { name: 'Classic Cheeseburger', price: 9.99, description: 'Juicy beef patty with cheese.', category: createdCategories[0]._id, image: '/public/images/burger.jpg', popular: true },
      { name: 'Pepperoni Pizza', price: 14.99, description: 'Large pizza with pepperoni slices.', category: createdCategories[1]._id, image: '/public/images/pizza.jpg', popular: true },
      { name: 'Coca Cola', price: 2.99, description: 'Chilled soda.', category: createdCategories[2]._id, image: '/public/images/coke.jpg' }
    ]);

    await Restaurant.insertMany([
        {
            name: 'Himilo Fast Food Central',
            description: 'The best burgers and pizzas in town.',
            location: { address: '123 Main Street', lat: 40.7128, lng: -74.0060 },
            menu: [createdProducts[0]._id, createdProducts[1]._id, createdProducts[2]._id],
            rating: 4.8,
            numReviews: 124
        }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
