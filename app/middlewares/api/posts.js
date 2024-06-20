const multer = require("multer");
const path_api = require('path');
const fs = require('fs');
const { check, validationResult } = require("express-validator");

const uploadBlogImage = multer({
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path_api.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extName) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const storagePath = path_api.join(__dirname, '../../storage/posts', req.userId.toString());

            if (!fs.existsSync(storagePath)) {
                fs.mkdirSync(storagePath, { recursive: true }, err => { console.log(err) })
            }

            cb(null, 'storage/posts/' + req.userId.toString());
        },
        filename: (req, file, cb) => {
            const filename = file.originalname.split('.');

            cb(null, filename[0] + '-' + Date.now() + '.' + filename[1]);
        }
    })
}).single('blogImage');

const addPostValidation = [
    check('title').notEmpty().withMessage("Title is required").trim(),
    check('description').notEmpty().withMessage('Description is required').trim(),
    check('content').notEmpty().withMessage('Content is required').trim(),
    check('blogImage').custom((value, { req }) => {
        if (req.file === undefined) {
            throw new Error('Blog image is required');
        } else if (!['image/jpeg', 'image/jpg', 'image/png'].includes(req.file.mimetype)) {
            throw new Error('Please select a valid image');
        }

        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const allErrors = {};

            errors.array().forEach(error => {
                allErrors[error.path] = error.msg;
            });

            res.status(400).json({
                status: false,
                msg: allErrors
            });
        } else {
            next();
        }
    }
];

const editPostValidation = [
    check('title').notEmpty().withMessage('Title is required').trim(),
    check('description').notEmpty().withMessage('Description is required').trim(),
    check('content').notEmpty().withMessage('Content is required').trim(),
    check('blogImage').custom((value, { req }) => {
        if (req.file !== undefined && !['image/jpeg', 'image/jpg', 'image/png'].includes(req.file.mimetype)) {
            throw new Error('Please upload a valid image file');
        }

        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const allErrors = [];

            errors.array().forEach(error => {
                allErrors[error.path] = error.msg;
            });

            res.status(401).json({
                status: false,
                msg: allErrors
            });
        } else {
            next();
        }
    }
];

module.exports = {
    uploadBlogImage,
    addPostValidation,
    editPostValidation
}