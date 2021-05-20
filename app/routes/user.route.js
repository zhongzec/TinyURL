const express = require('express');
const router = express.Router();

// import controller
const { requireSignin } = require('../controllers/auth.controller');
const { readController, updateController } = require('../controllers/user.controller');
const { checkoutController, billingController } = require('../controllers/stripe.controller');

router.get('/user/:id', requireSignin, readController);
router.put('/user/update', requireSignin, updateController);

router.post('/checkout', requireSignin, checkoutController);
router.post('/billing', requireSignin, billingController);

module.exports = router;