const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { getAdminProfile, updateAdminProfile } = require("../controllers/adminController");
const { getUsers, deleteUser, updateUser, createUser } = require("../controllers/userController");


router.get("/profile", protect, adminOnly, getAdminProfile);
router.put("/profile", protect, adminOnly, upload.single("profileImage"), updateAdminProfile);

router.get("/dashboard", protect, adminOnly, getUsers);

router.post("/users", protect, adminOnly, createUser);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;