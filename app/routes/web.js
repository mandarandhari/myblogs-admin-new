const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/login');
})

router.get('/login', authController.login_get);

router.get('/register', authController.register_get);

router.get('/forgot-password', authController.forgot_password_get);

router.get('/change-password', authController.change_password_get);

module.exports = router;