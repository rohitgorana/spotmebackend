var mongoose = require('mongoose')


var Schema = mongoose.Schema;
var bookingSchema = new Schema({
  parking : {type : mongoose.Schema.Types.ObjectId, ref: 'Parking'},
  duration :{
      from : {type: Date, default: Date.now},
      to: {type : Date, default: Date.now + 3600000}
  },
  checkoutStatus : {
      done : {type: Boolean, default: false},
      time : Date
  }
});

bookingSchema.methods.bookNew = function(booking){
    this.parking = booking.parking;
    this.duration.from = booking.from;
    if(booking.to){
        this.duration.to = booking.to;
    }
    this.save();
}

bookingSchema.methods.checkout = function(){
    if(Date.now + 1000 > this.duration.to){
        
    }
}



var Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;