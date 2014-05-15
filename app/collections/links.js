// NOTE: this file is not needed when using MongoDB
var db = require('../config');

var links = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
}, {id: true});

module.exports = links;
