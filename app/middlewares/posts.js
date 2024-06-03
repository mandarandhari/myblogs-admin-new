const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { check, validationResult } = require("express-validator");

const uploadBlogImage = multer({
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extName) {
            return cb(null, true);
        } else {
            return cb(null, false);
        }
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const storagePath = path.join(__dirname, '../../storage/posts', req.session.user.id.toString());

            if (!fs.existsSync(storagePath)) {
                fs.mkdirSync(storagePath, { recursive: true }, err => { console.log(err); });
            }

            cb(null, 'storage/posts/' + req.session.user.id.toString());
        },
        filename: (req, file, cb) => {
            const filename = file.originalname.split('.');

            cb(null, filename[0] + '-' + Date.now() + '.' + filename[1]);
        },
        
    })
}).single('blogImage');

const addPostValidation = [
    check('title').notEmpty().withMessage('Title is required').trim(),
    check('description').notEmpty().withMessage('Description is required').trim(),
    check('content').notEmpty().withMessage('Content is required'),
    check('blogImage').custom((value, {req}) => {
        if (req.file === undefined) {
            throw new Error('Blog image is required');
        } else if ( ! ['image/jpg', 'image/jpeg', 'image/png'].includes(req.file.mimetype)) {
            throw new Error('Please select a valid image file');
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

            res.render('template', { errors: allErrors, title: 'Add Blog', formData: req.body, 'view': 'posts/add', active: 'posts' });
        } else {
            next();
        }
    }
];

const editPostValidation = [
    check('title').notEmpty().withMessage('Title is required').trim(),
    check('description').notEmpty().withMessage('Description is required').trim(),
    check('content').notEmpty().withMessage('Content is required'),
    check('blogImage').custom((value, {req}) => {
        if (req.file !== undefined && ! ['image/jpg', 'image/jpeg', 'image/png'].includes(req.file.mimetype)) {
            throw new Error('Please select a valid image file');
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

            res.render('template', { errors: allErrors, title: 'Add Blog', formData: req.body, 'view': 'posts/add', active: 'posts' });
        } else {
            next();
        }
    }
];

module.exports = {
    uploadBlogImage,
    addPostValidation,
    editPostValidation
};