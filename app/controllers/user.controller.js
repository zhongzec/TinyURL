const User = require('../models/auth.model');
const expressJwt = require('express-jwt');

exports.readController = (req, res) => {
    const userId = req.params.id;
    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        const {email, name, _id, plan} = user;
        const subscriptionExpired = (user.plan === 'none')
            || (user.plan !== 'none' && user.endDate < new Date().getTime())

        res.json({
            email,
            name, 
            _id, 
            plan,
            subscriptionExpired,
        });
    });
};

exports.updateController = (req, res) => {
    const { name, password } = req.body;

    User.findOne({ _id: req.user._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }

            const {email, name, _id} = updatedUser;
            const subscriptionExpired = (updatedUser.plan === 'none')
                || (updatedUser.plan !== 'none' && updatedUser.endDate < new Date().getTime())

            res.json({
                email,
                name, 
                _id, 
                subscriptionExpired,
            });
        });
    });
};