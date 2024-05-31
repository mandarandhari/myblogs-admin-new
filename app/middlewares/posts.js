const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { check, validationResult } = require("express-validator");

const uploadBlogImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const storagePath = path.join(__dirname, '../../storage/posts', req.session.user.id.toString());

            if (!fs.existsSync(storagePath)) {
                console.log('abcd');
                fs.mkdirSync(storagePath, { recursive: true }, err => { console.log(err); });
                console.log('xyz');
            }

            cb(null, 'storage/posts/' + req.session.user.id.toString());
        },
        filename: (req, file, cb) => {
            const filename = file.originalname.split('.');

            cb(null, filename[0] + '-' + Date.now() + '.' + filename[1]);
        }
    })
}).single('blogImage');

const addBlogValidation = [
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
            console.log(req.body);
            res.render('template', { errors: allErrors, title: 'Add Blog', formData: req.body, 'view': 'posts/add', active: 'posts' });
        } else {
            next();
        }
    }
];

module.exports = {
    uploadBlogImage,
    addBlogValidation
};