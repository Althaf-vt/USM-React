const User = require('../models/User');
const bcrypt = require('bcryptjs')

const getUsers = async(req, res) => {

    const pageSize = 5;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.search
        ? {
            name : {$regex: req.query.search, $options: 'i'},
        }
        : {};

    const count = await User.countDocuments({
        role: "user",
        ...keyword
    })

    const users = await User.find({
        role: 'user',
        ...keyword
    })
    .select('-password')
    .sort({createdAt: -1})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

    return res.json({
        users,
        page,
        pages: Math.ceil(count / pageSize)
    });
}

const deleteUser = async(req,res) => {
    const user = await User.findById(req.params.id);

    if(user){
        await user.deleteOne();
        return res.json({message: 'User removed'});
    }else{
        return res.status(404).json({message: "User not found"});
    }
}

const getUserProfile = async (req,res) => {
    const user = await User.findById(req.user._id).select("-password");

    if(user){
        res.json(user);
    }else{
        res.status(404).json({message:"User not found"});
    }
}

const updateUserProfile = async(req,res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        
        if(req.file){
            user.profileImage = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await user.save();

        return res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
            role: updatedUser.role,
        });
    }else{
        return res.status(404).json({message: "User not found"});
    }
}


const createUser = async (req,res)=> {
    const {name,email,password,role} = req.body;

    const userExists = await User.findOne({email});

    if(userExists){
        return res.status(400).json({message: 'User already exists'});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'user'
    });

    return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    });
}

const updateUser = async(req, res) => {
    const { name, email, role } = req.body;
    // const normalizedEmail = email?.trim().toLowerCase();
    const user = await User.findById(req.params.id);

    if(user){

        if(email && email !== user.email){
            const emailExists = await User.findOne({email})

            if(emailExists){
                return res.status(400).json({message: "Email already exists"});
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        const updatedUser = await user.save();

        return res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        });
    }else{
        return res.status(404).json({message: "User not found"});
    }
}
module.exports = {getUsers, deleteUser, updateUserProfile, getUserProfile, createUser, updateUser};