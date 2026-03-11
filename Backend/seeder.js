const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const createAdmin = async() => {
    try {
        await User.deleteMany({email : 'admin@test.com'});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        await User.create({
            name: 'Admin',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log("Admin created");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

createAdmin();