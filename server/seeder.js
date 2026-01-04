const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const products = require('./data/products');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt);

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: password,
            isAdmin: true
        });

        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser._id };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
