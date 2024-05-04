const express = require('express');
const loginController = require('../controllers/login');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/login');
})

router.get('/login', loginController.login_get);

module.exports = router;