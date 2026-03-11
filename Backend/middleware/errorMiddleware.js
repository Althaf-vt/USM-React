const multer = require("multer");

const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }

    if (err.message?.includes("Only image files")) {
        return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Server Error" });
};

module.exports = errorHandler;