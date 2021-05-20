var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// shortURL request record
var RequestSchema = new Schema({
    userId: String, 
    shortUrl: String,
    referer: String,
    platform: String,
    browser: String,
    country: String,
    timestamp: Date
});

var requestModel = mongoose.model("RequestModel", RequestSchema);

module.exports = requestModel;