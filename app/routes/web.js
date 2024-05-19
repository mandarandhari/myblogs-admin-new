const express = require('express');
const authMiddleware = require('../middlewares/auth');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', authMiddleware.isLoggedIn, (req, res) => {
    console.log(req?.session);
    if (req?.session?.isLoggedIn !== undefined) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
})

router.get('/login', authMiddleware.isLoggedIn, authController.login_get);

router.post('/login', authMiddleware.isLoggedIn, authMiddleware.loginFormValidation, authController.login_post);

router.get('/register', authMiddleware.isLoggedIn, authController.register_get);

router.post('/register', [authMiddleware.isLoggedIn, authMiddleware.registrationFormValidation], authController.register_post)

router.get('/forgot-password', authMiddleware.isLoggedIn, authController.forgot_password_get);

router.get('/change-password', authMiddleware.isLoggedIn, authController.change_password_get);

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {});
});

module.exports = router;