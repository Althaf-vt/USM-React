const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../middleware/generateToken');

const registerUser = async(req,res) => {
    try {
        const {name, email, password} = req.body;

        const userExists = await User.findOne({email});

        if(userExists){
            return res.status(400).json({message : "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            token: generateToken(user._id)
        });

    } catch (error) {
        return res.status(500).json({message: "Server Error"});
    }
}

const loginUser = async(req,res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user || user.role !== 'user'){
            return res.status(401).json({message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            token: generateToken(user._id)
        });
    } catch (error) {
        return res.status(500).json({message: "Server Error"});
    }
}

const loginAdmin  = async(req,res) => {
    try {
        const {email, password} = req.body;

        const admin = await User.findOne({email});

        if(!admin || admin.role !== 'admin'){
            return res.status(401).json({message: 'Admin not found'});
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if(!isMatch){
            return res.status(401).json({message: "Invalid credentials"});
        }

        return res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            profileImage: admin.profileImage,
            token: generateToken(admin._id),
        });
    } catch (error) {
        return res.status(500).json({message: "Server Error"});
    }
}



module.exports = {registerUser, loginUser, loginAdmin}

