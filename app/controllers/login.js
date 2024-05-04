const login_get = (req, res) => {
    res.render('login', { title: 'Login' });
}

module.exports = {
    login_get
}