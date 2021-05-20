
const urlService = require("../services/url.service");
const statsService = require("../services/stats.service");
const UrlModel = require("../models/url.model");
const RequestModel = require("../models/request.model");


exports.getShortUrlController = (req, res) => {
  console.log(req.body);
  
  const {userId, longUrl, subscriptionExpired} = req.body;
  urlService.getShortUrl(userId, longUrl, subscriptionExpired, function (url) {
    if (url) {
      res.json(url);
    } else {
      res.status(404).send("Short URL Found Error!");
    }
  });
}

exports.getLongUrlController = (req, res) => {
  const shortUrl = req.params.shortUrl;
  urlService.getLongUrl(shortUrl, function (url) {
      if (url) {
          res.json(url);
      } else {
          res.status(404).send("Long URL Not Found!");
      }
  });
}


exports.getRequestInfoController = (req, res) => {
  statsService.getUrlInfo(req.params.shortUrl, req.params.info, function (data) {
    res.json(data);
  })
}


exports.getMyUrlsController = (req, res) => {
  const userId = req.user._id
  urlService.getMyUrls(userId, function (urls) {
      res.json(urls);
  });
}


exports.deleteMyUrlController = (req, res) => {
  const userId = req.user._id;
  const shortUrl = req.params.shortUrl;

  UrlModel.deleteOne({shortUrl, userId}, (err, res) => {
    if (err) {
      return res.status(500).json({
        error: 'Delete Url Failed. Please try again',
      })
    }


    RequestModel.deleteMany({shortUrl, userId}, (err, res) => {
      if (err) {
        return res.status(500).json({
          error: 'Delete Url Failed. Please try again',
        })
      }
    })
  })
}
