const express = require('express');
const authMiddleware = require('../middlewares/auth');
const authController = require('../controllers/auth');
const postsController = require('../controllers/posts');
const postsMiddleware = require('../middlewares/posts');

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
    res.render('template', { view: 'dashboard', active: 'dashboard', title: 'Dashboard' });
});

router.get('/posts', authMiddleware.isLoggedIn, postsController.posts_get);

router.get('/posts/add', authMiddleware.isLoggedIn, postsController.add_post_get);

router.post('/posts/add', [authMiddleware.isLoggedIn, postsMiddleware.uploadBlogImage, postsMiddleware.addPostValidation], postsController.add_post_post);

router.get('/post/edit/:id', authMiddleware.isLoggedIn, postsController.edit_post_get);

router.post('/post/edit/:id', [authMiddleware.isLoggedIn, postsMiddleware.uploadBlogImage, postsMiddleware.editPostValidation], postsController.edit_post_post);

router.get('/post/delete/:id', authMiddleware.isLoggedIn, postsController.delete_post_get);

module.exports = router;