const express = require('express');
const authMiddleware = require('../middlewares/auth');
const authController = require('../controllers/auth');
const blogsController = require('../controllers/blogs');

const router = express.Router();

router.get('/', (req, res) => {
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

router.get('/dashboard', authMiddleware.isLoggedIn, (req, res) => {
    res.render('template', { view: 'dashboard', active: 'dashboard' });
});

router.get('/blogs', blogsController.blogs_get);

router.get('/blogs/add', authMiddleware.isLoggedIn, blogsController.add_blog_get);

module.exports = router;