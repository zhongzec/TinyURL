const express = require('express');
const router = express.Router();
const urlService = require("../services/url.service");
const statsService = require("../services/stats.service");

var redis = require("redis");
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var redisClient = redis.createClient(port, host);

// redirect to longURL
router.get("*", function (req, res) {
    var shortUrl = decodeURIComponent(req.originalUrl.slice(1));
    urlService.getLongUrl(shortUrl, function (url) {
        if (url) {
            const {longUrl, userId} = url;
            if (userId !== "") {
                // only if userId !== "" => user with subscriptions
                statsService.logRequest(userId, shortUrl, req);
            }
            res.redirect(longUrl);
            
        } else {
            // delete expired url (not in mongoDB but in redis)
            redisClient.del(shortUrl + "longUrl")
            redisClient.del(shortUrl + "userId")
            res.status(404).send("URL not found or has expired!");
        }
    });
});

module.exports = router;