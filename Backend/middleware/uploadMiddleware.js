const multer = require('multer');
const path = require('path');

// Storage config

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/');
    },
    filename(req,file,cb){
        cb(
            null,
            `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// File filter (only images)

const fileFilter = (req,file,cb) => {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if(extname && mimetype){
        cb(null, true);
    }else{
        cb("Images only (jpg, jpeg, png, webp)");
    }
}

const upload = multer({
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter
});

module.exports = upload;