var mongoose = require('mongoose')


var Schema = mongoose.Schema;
var reservationSchema = new Schema({
  parking : {type : mongoose.Schema.Types.ObjectId, ref: 'Parking'},
  vehicle: {type: mongoose.Schema.Types.ObjectId, ref: 'User.vehicles'},
  duration :{
      from : {type: Date, default: Date.now},
      to: {type : Date, default: Date.now + 3600000}
  },
  checkoutStatus : {
      done : {type: Boolean, default: false},
      time : Date
  }
});

reservationSchema.methods.bookNew = function(reservation){
    this.parking = reservation.parking;
    this.duration.from = reservation.from;
    this.vehicl= reservation.vehicle;
    if(reservation.to){
        this.duration.to = reservation.to;
    }
    this.save();
}

reservationSchema.methods.checkout = function(){
    if(Date.now + 1000 > this.duration.to){

    }
}



var reservation = mongoose.model('reservation', reservationSchema);
module.exports = reservation;