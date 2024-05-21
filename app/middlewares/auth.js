
const { check, validationResult } = require('express-validator');
const User = require('../models/user');

const isLoggedIn = (req, res, next) => {
    const authRoutes = ['/login', '/register', '/forgot-password', '/change-password'];

    if (req?.session?.isLoggedIn !== undefined && authRoutes.includes(req.path)) {
        res.redirect('/dashboard');
    } else {
        return next();
    }
}

const registrationFormValidation = [
    check('firstName').notEmpty().withMessage('First name must be required').trim(),
    check('lastName').notEmpty().withMessage('Last name must be required').trim(),
    check('email').notEmpty().withMessage('Email must be required').trim().isEmail().withMessage('Please enter valid email').custom(async value => {
        const user = await User.findOne({ where: { email: value } })

        if (user) {
            throw new Error('Email already exists');
        }
    }),
    check('password').notEmpty().withMessage('Password must be required').trim().isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
    check('confirmPassword').custom((value, { req }) => {
        return value === req.body.password
    }).withMessage('Passwords not matching'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const allErrors = {};

            errors.array().forEach(error => {
                allErrors[error.path] = error.msg;
            });

            res.render('register', { errors: allErrors, title: 'Register', formData: req.body })
        } else {
            next();
        }
    }
];

const loginFormValidation = [
    check('email').notEmpty().withMessage('Email is required').trim(),
    check('password').notEmpty().withMessage('Password is required').trim(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const allErrors = {};

            errors.array().forEach(error => {
                allErrors[error.path] = error.msg;
            });

            res.render('login', { errors: allErrors, title: 'Login', formData: { email: req.body.email } });
        } else {
            next();
        }
    }
];

module.exports = {
    isLoggedIn,
    registrationFormValidation,
    loginFormValidation
}

