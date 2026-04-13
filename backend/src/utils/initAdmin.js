const User = require('../models/User');

const initializeAdmin = async () => {
    try {
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
