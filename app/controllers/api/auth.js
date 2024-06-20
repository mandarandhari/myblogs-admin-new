const jwt = require('jsonwebtoken');
const User = require('./../../models/user');
const bcryptjs = require('bcryptjs');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: false,
                msg: 'User not found'
            });
        }

        const passwordMatch = await bcryptjs.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: false,
                msg: "Password not matching"
            });
        }

        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: '1h'
        });

        res.status(200).json({
            status: true,
            data: { token }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: "Something went wrong"
        });
    }
}

const register = async (req, res) => {
    const user = await User.create({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: bcryptjs.hashSync(req.body.password, 10)
    });

    let status = false;
    let msg = "An error occurred while creating a user";

    if (user) {
        status = true;
        msg = "New user created!";
    }

    return res.status(200).json({ status, msg });
}

module.exports = {
    login,
    register
}