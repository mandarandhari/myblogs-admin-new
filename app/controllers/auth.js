const login_get = (req, res) => {
    res.render('login', { title: 'Log In' });
}

const register_get = (req, res) => {
    res.render('register', { title: 'Register' });
}

const forgot_password_get = (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password' });
}

const change_password_get = (req, res) => {
    res.render('change-password', { title: 'Change Password' });
}

module.exports = {
    login_get,
    register_get,
    forgot_password_get,
    change_password_get
}