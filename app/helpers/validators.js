const { check } = require('express-validator');

exports.validSignup = [
    check('name', 'Name is required').notEmpty()
    .isLength({
        min: 4,
        max: 10
    }).withMessage('Name must have 4 to 10 characters'),

    check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
    check('password', 'Password is required').notEmpty(),

    check('password').isLength({
        min: 4,
        max: 10
    }).withMessage('Password must have 4 to 10 characters').matches(/\d/).withMessage('Password must contain a number')
]

exports.validLogin = [
    check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
    check('password', 'Password is required').notEmpty(),
    check('password').isLength({
        min: 4,
        max: 10
    }).withMessage('Password must have 4 to 10 characters').matches(/\d/).withMessage('Password must contain a number')
]


exports.forgotPasswordValidator = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Must be a valid email address')
];

exports.resetPasswordValidator = [
    check('newPassword').isLength({
        min: 4,
        max: 10
    }).withMessage('Password must have 4 to 10 characters').matches(/\d/).withMessage('Password must contain a number')
];