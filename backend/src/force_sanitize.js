const mongoose = require('mongoose');
const dotenv = require('dotenv');

// We load the .env from the root
dotenv.config();

const Product = require('./models/Product');
const Category = require('./models/Category');

const forceSanitize = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery');
        console.log('Connected.');

        console.log('Sanitizing Products...');
        const products = await Product.find({ image: { $regex: 'localhost:5000' } });
        for (let p of products) {
            console.log(`Fixing product: ${p.name}`);
            const match = p.image.match(/(\/(public|images)\/.*)/);
            if (match) {
                p.image = match[1];
            } else {
                p.image = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400`;
            }
            await p.save();
        }

        console.log('Sanitizing Categories...');
        const categories = await Category.find({ image: { $regex: 'localhost:5000' } });
        for (let c of categories) {
            console.log(`Fixing category: ${c.name}`);
            const match = c.image.match(/(\/(public|images)\/.*)/);
            if (match) {
                c.image = match[1];
            } else {
                c.image = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400`;
            }
            await c.save();
        }
        
        console.log(`Successfully sanitized ${products.length} products and ${categories.length} categories.`);
        process.exit(0);
    } catch (e) {
        console.error('Sanitization failed:', e);
        process.exit(1);
    }
};

forceSanitize();
