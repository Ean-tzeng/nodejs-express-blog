var mongoose = require('mongoose');
var timestamp = require('mongoose-timestamp');
Schema = new mongoose.Schema({
  username: String,
  password:String
});
var User = module.exports = mongoose.model('User', Schema);
module.exports.getUserByUsername = function(username , callback){
  User.findOne({username: username}, callback);
  
}
