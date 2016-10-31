var mongoose = require('mongoose');
var timestamp = require('mongoose-timestamp');
var Schema = new mongoose.Schema({
  author:Object,
  title:String,
  content:String
});
Schema.plugin(timestamp);
module.exports = mongoose.model('Post', Schema);
