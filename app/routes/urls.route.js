const express = require('express');
const router = express.Router();

const { requireSignin } = require('../controllers/auth.controller');
const { requireSubscription } = require('../controllers/stripe.controller');
const { 
    getShortUrlController, getLongUrlController, 
    getRequestInfoController, getMyUrlsController, 
    deleteMyUrlController } = require('../controllers/urls.controller');

// get shortURL
router.post("/urls", getShortUrlController);

// get longURL
router.get("/urls/:shortUrl", getLongUrlController);

// get shortURL request info
router.get("/urls/:shortUrl/:info", requireSignin, requireSubscription, getRequestInfoController); /// signin test

// get url records table for user
router.get("/myUrls", requireSignin, requireSubscription, getMyUrlsController);

// delete short url for user
router.delete("/deleteUrl/:shortUrl", requireSignin, requireSubscription, deleteMyUrlController);

module.exports = router;