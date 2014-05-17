var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var ip = process.env.mongo || 'mongodb://localhost/test';

mongoose.connect(ip);

var Schema = mongoose.Schema;

// Delcare schemas

var links = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0},
}, {id: true});

var users = new Schema({
  username: String,
  password:   String,
  date: { type: Date, default: Date.now }
}, {id: true});

// Declare methods
users.methods.hashPassword = function () {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this);
};

users.methods.comparePassword = function (attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

// Set event listeners
links.pre("validate", function (next) {
  var shasum = crypto.createHash('sha1')
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

users.pre('validate', function (next) {
  var self = this;
  this.hashPassword().then(function(hash){
    self.password = hash;
    next();
  });
});

// Instantiate models
exports.Link = mongoose.model('Link', links);
exports.User = mongoose.model('User', users);




