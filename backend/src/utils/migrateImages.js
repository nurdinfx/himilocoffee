const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const Product = require('../models/Product');
const Category = require('../models/Category');

const migrate = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for migration...');

        const productionUrl = 'https://himilocoffee.onrender.com';
        const localhostMatch = /http:\/\/localhost:5000/g;
        const localIpMatch = /http:\/\/127\.0\.0\.1:5000/g;

        // Migrate Products
        const products = await Product.find({ 
            $or: [
                { image: { $regex: 'localhost' } },
                { image: { $regex: '127.0.0.1' } }
            ]
        });

        console.log(`Found ${products.length} products to migrate.`);
        for (let product of products) {
            const oldImage = product.image;
            product.image = oldImage.replace(localhostMatch, productionUrl).replace(localIpMatch, productionUrl);
            await product.save();
            console.log(`Updated product: ${product.name}`);
        }

        // Migrate Categories
        const categories = await Category.find({ 
            $or: [
                { image: { $regex: 'localhost' } },
                { image: { $regex: '127.0.0.1' } }
            ]
        });

        console.log(`Found ${categories.length} categories to migrate.`);
        for (let category of categories) {
            const oldImage = category.image;
            category.image = oldImage.replace(localhostMatch, productionUrl).replace(localIpMatch, productionUrl);
            await category.save();
            console.log(`Updated category: ${category.name}`);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
