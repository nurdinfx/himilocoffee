const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const sanitizeDatabase = async () => {
    try {
        console.log('Sanitizing database (removing localhost precursors)...');
        
        // Sanitize Products
        const products = await Product.find({ image: { $regex: 'localhost:5000' } });
        for (let p of products) {
            // Remove everything before /public or /images
            const match = p.image.match(/(\/(public|images)\/.*)/);
            if (match) {
                p.image = match[1];
                await p.save();
            } else {
                // If it's a broken link like localhost:5000/pizza.jpg without /public
                const filename = p.image.split('/').pop();
                p.image = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400`; // Placeholder
                await p.save();
            }
        }

        // Sanitize Categories
        const categories = await Category.find({ image: { $regex: 'localhost:5000' } });
        for (let c of categories) {
            const match = c.image.match(/(\/(public|images)\/.*)/);
            if (match) {
                c.image = match[1];
                await c.save();
            }
        }
        
        console.log(`Sanitized ${products.length} products and ${categories.length} categories.`);
    } catch (e) {
        console.error('Sanitization failed:', e.message);
    }
};

const initializeAdmin = async () => {
    try {
        await sanitizeDatabase();
        const adminCount = await User.countDocuments({ role: 'admin' });
        
        if (adminCount === 0) {
            console.log('No admin user found. Creating default admin...');
            await User.create({
                name: 'System Admin',
                email: 'admin@example.com',
                password: '123456',
                role: 'admin'
            });
            console.log('Default admin created: admin@example.com / 123456');
        } else {
            console.log('Admin user(s) already exist.');
        }
    } catch (error) {
        console.error('Error initializing admin user:', error.message);
    }
};

module.exports = initializeAdmin;
