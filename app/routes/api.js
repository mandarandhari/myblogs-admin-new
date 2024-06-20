const express = require('express');
const authMiddleware = require('./../middlewares/api/auth');
const authController = require('./../controllers/api/auth');
const postController = require('./../controllers/api/posts');
const postMiddleware = require('./../middlewares/api/posts');

const router = express.Router();

router.post('/api/login', authMiddleware.loginValidation, authController.login);

router.post('/api/register', authMiddleware.registerValidation, authController.register);

router.get('/api/posts', authMiddleware.isLoggedIn, postController.posts);

router.get('/api/post/:id', authMiddleware.isLoggedIn, postController.post);

router.post('/api/post/add', [authMiddleware.isLoggedIn, postMiddleware.uploadBlogImage, postMiddleware.addPostValidation], postController.addPost);

router.post('/api/post/edit/:id', [authMiddleware.isLoggedIn, postMiddleware.uploadBlogImage, postMiddleware.editPostValidation], postController.editPost);

router.get('/api/post/delete/:id', authMiddleware.isLoggedIn, postController.deletePost);

module.exports = router;