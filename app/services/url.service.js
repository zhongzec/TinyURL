var UrlModel = require("../models/url.model");
var User = require("../models/auth.model");
var lexicon = require("emoji-lexicon");

var redis = require("redis");
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var redisClient = redis.createClient(port, host);

var encode = [];
var genCharArray = function (charA, charZ) {
    var arr = [];
    var i = charA.charCodeAt(0);
    var j = charZ.charCodeAt(0);

    for (; i <= j; i++) {
        arr.push(String.fromCharCode(i));
    }
    return arr;
};

encode = encode.concat(genCharArray("A", "Z"));
encode = encode.concat(genCharArray("a", "z"));
encode = encode.concat(genCharArray("0", "9"));

// generate shortURL and save to redis and db
var getShortUrl = function (userId, longUrl, subscriptionExpired, callback) {
    console.log("need a shortUrl from longUrl " + longUrl);
    if (longUrl.indexOf("http") === -1) {
        longUrl = "http://" + longUrl;
    }
    if (subscriptionExpired) {
        userId = "";
    }

    redisClient.get(userId + ":" + longUrl, function (err, shortUrl) {
        // if longUrl in redis
        if (shortUrl) {
            console.log("Byebye mongo!");
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl,
            });

        } else {
            
            UrlModel.findOne({userId: userId, longUrl: longUrl}, function (err, url) {
                // if longUrl in db
                if (url) {
                    console.log('Mongo is called');
                    // save to redis
                    redisClient.set(shortUrl + ":" + "longUrl", longUrl, 'EX', 60);
                    redisClient.set(shortUrl + ":" + "userId", userId, 'EX', 60);
                    redisClient.set(userId + ":" + longUrl, url.shortUrl, 'EX', 60);

                    callback(url);
                } else {
                    
                    // if no longUrl match, generate shortUrl, save to db and cache
                    console.log('New shortUrl generated.');
                    generateShortUrl(userId, function (shortUrl) {
                        var url = new UrlModel({
                            shortUrl: shortUrl,
                            longUrl: longUrl,
                            userId: userId,
                            creationTime: new Date()
                        });
                        console.log(url);
                        // save to db and redis
                        url.save();

                        redisClient.set(shortUrl + ":" + "longUrl", longUrl, 'EX', 60);
                        redisClient.set(shortUrl + ":" + "userId", userId, 'EX', 60);
                        redisClient.set(userId + ":" + longUrl, shortUrl, 'EX', 60);
                        callback(url);
                    });
                }
            });
        }
    });
};

// get shortURL
var generateShortUrl = function (userId, callback) {
    if (userId === "") {
        callback(convertToChar());
    } else {
        // check if user has plan and not expired
        User.findById(userId, (err, user) => {
            if (err || user.plan == 'none' || user.endDate == null 
            || user.endDate < new Date().getTime()) {
                callback(convertToChar());

            } else {
                callback(convertToEmoji());
            }
        })
    }
};

// randomly generate shortURL using emoji
var convertToEmoji = function () {
    do {
        var result = "";
        for (var x = 0; x < 6; x++) {
            result += lexicon[Math.floor(Math.random() * lexicon.length)];
        }

        // UrlModel.findOne({shortUrl: result}, (err, data) => {
        //     if (data) {

        //     } else {}
        // })
    } while (false);

    return result;
};

// randomly generate shortURL using 62 characters
var convertToChar = function () {
    do {
        var result = "";
        for (var x = 0; x < 6; x++) {
            result += encode[Math.floor(Math.random() * encode.length)];
        }
    } while (false); 

    return result;
};

// get longURL from redis
var getLongUrl = function (shortUrl, callback) {
    console.log("need a longUrl from shortUrl " + shortUrl);
    
    redisClient.get(shortUrl + ":" + "longUrl", function (err, longUrl) {
        // if shortUrl in redis
        console.log(longUrl)
        if (longUrl) {
            redisClient.get(shortUrl + ":" + "userId", function (err, userId) {
                console.log(userId)
                if (userId !== undefined) {
                    console.log("Byebye mongo!");
                    callback({
                        shortUrl: shortUrl,
                        longUrl: longUrl,
                        userId: userId,
                    });

                } else {
                    // if userId not in redis
                    console.log('Mongo is called');
                    UrlModel.findOne({shortUrl: shortUrl}, function (err, url) {
                        console.log(url)
                        if (url) {
                            // save to redis
                            redisClient.set(shortUrl + ":" + "longUrl", url.longUrl, 'EX', 60);
                            redisClient.set(shortUrl + ":" + "userId", url.userId, 'EX', 60);
                        }

                        callback(url);
                    });
                }
            })

        } else {
            // if shortUrl not in redis
            console.log('Mongo is called');
            UrlModel.findOne({shortUrl: shortUrl}, function (err, url) {
                console.log(url)
                if (url) {
                    // save to redis
                    redisClient.set(shortUrl + ":" + "longUrl", url.longUrl, 'EX', 60);
                    redisClient.set(shortUrl + ":" + "userId", url.userId, 'EX', 60);
                }

                callback(url);
            });
        }
    })
};

// get all url for user
var getMyUrls = function (userId, callback) {
    UrlModel.find({ userId: userId}, function (err, urls) {
        callback(urls);
    });
};

module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl,
    getMyUrls: getMyUrls
};