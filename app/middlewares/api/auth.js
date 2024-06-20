const { check, validationResult } = require("express-validator");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            status: false,
            msg: "Access denied"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        req.userId = decoded.userId;

        next();
    } catch (error) {
        res.status(401).json({
            status: false,
            msg: "Invalid token"
        });
    }
}

const loginValidation = [
    check('email').notEmpty().withMessage('Email is required').trim().custom(async (value, { req }) => {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            throw new Error('User does not exists');
        }
    }),
    check('password').notEmpty().withMessage('Password is required').trim(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const allErrors = {};

            errors.array().forEach(error => {
                allErrors[error.path] = error.msg;
            });

            res.status(400).json({
                status: false,
                msg: {
                    errors: allErrors
                }
            });
        } else {
            next();
        }
    }
];

const registerValidation = [
    check('firstname').notEmpty().withMessage('First name is required').trim(),
    check('lastname').notEmpty().withMessage('Last name is required').trim(),
    check('email').notEmpty().withMessage('Email is required').trim().isEmail().withMessage('Please enter valid email').custom(async (value, { req }) => {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (user) {
            throw new Error('User already exists');
        }
    }),
    check('password').notEmpty().withMessage('Password is required').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const allErrors = {};

            errors.array().forEach(error => {
                allErrors[error.path] = error.msg;
            });

            res.status(400).json({
                status: false,
                msg: {
                    errors: allErrors
                }
            });
        } else {
            next();
        }
    }
];

module.exports = {
    isLoggedIn,
    registerValidation,
    loginValidation
}