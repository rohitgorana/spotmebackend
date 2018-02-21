var mongoose = require('mongoose')


var Schema = mongoose.Schema;
var userSchema = new Schema({
  username : String,
  password : String,
  name : {
    first : String,
    last : String
  }
});


userSchema.methods.addNewUser = function(user){
    this.username = user.username;
    this.password = user.password;
    this.name = user.name;

    this.save();
}


var User = mongoose.model('User', userSchema);
module.exports = User;