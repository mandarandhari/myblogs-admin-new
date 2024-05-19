const bcrypt = require('bcryptjs');
const User = require("../models/user");

const login_get = (req, res) => {
    res.render('login', { title: 'Log In', formData: {}, errors: {} });
}

const login_post = (req, res) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    req.session.user = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    };

                    req.session.isLoggedIn = true;

                    console.log(req.session);

                    res.redirect('/dashboard');
                } else {
                    res.render('login', { title: 'Login', formData: { email: req.body.email }, errors: { email: "Invalid credentials" } });
                }
            } else {
                res.render('login', { title: 'Login', formData: { email: req.body.email }, errors: { email: "User does not exists" } });
            }
        })
}

const register_get = (req, res) => {
    res.render('register', { title: 'Register', formData: {}, errors: {} });
}

const register_post = (req, res) => {
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })
        .then(user => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
}

const forgot_password_get = (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password' });
}

const change_password_get = (req, res) => {
    res.render('change-password', { title: 'Change Password' });
}

module.exports = {
    login_get,
    login_post,
    register_get,
    register_post,
    forgot_password_get,
    change_password_get
}