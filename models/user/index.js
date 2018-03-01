var mongoose = require('mongoose')


var Schema = mongoose.Schema;
var userSchema = new Schema({
  username : {type : String, unique: true},
  password : String,
  name : {
    first : String,
    last : String
  },
  vehicles : [{
    regNo: {
      code: String,
      number: String
    },
    class: String,
    fuel: String,
    model: String,

  }],
  accommodations : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parking'
    }
  ]

});


userSchema.methods.addNewUser = function(user){
    this.username = user.username;
    this.password = user.password;
    this.name = user.name;

    this.save();
}




var User = mongoose.model('User', userSchema);
module.exports = User;