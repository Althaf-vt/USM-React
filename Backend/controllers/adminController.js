const User = require('../models/User');

const getAdminProfile = async (req, res) => {
    const admin = await User.findById(req.user._id).select("-password");

    if (!admin || admin.role !== "admin") {
        return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
};

const updateAdminProfile = async (req, res) => {
    const admin = await User.findById(req.user._id);

    if (!admin || admin.role !== "admin") {
        return res.status(404).json({ message: "Admin not found" });
    }

    admin.name = req.body.name || admin.name;

    if (req.file) {
        admin.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedAdmin = await admin.save();

    res.json({
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        profileImage: updatedAdmin.profileImage
    });
};

module.exports = {
    getAdminProfile,
    updateAdminProfile
};