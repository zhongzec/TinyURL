var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
    shortUrl: String,
    longUrl: String,
    userId: String, 
    creationTime: Date,
    emoji: false,
});

var urlModel = mongoose.model("UrlModel", UrlSchema);

module.exports = urlModel;