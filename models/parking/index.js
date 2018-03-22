var mongoose = require('mongoose')


var Schema = mongoose.Schema;
var parkingSchema = new Schema({
  name: String,
  address: String,
  location: {
      type: {type : String, default : 'Point'},
      coordinates : {
          type : [Number],
          index : '2d'
      }
  },
  vehicles:[{
      class: String,
      capacity: Number,
      vacant : Number,
      rate: Number,
      rateDuration: {type: String, default: 'day'}
  }]
  
}); 

parkingSchema.statics.getSuggestion = function(point, vehicle, callback){
    this.find({
        'location.coordinates': {'$near': point, '$maxDistance': 50/6371}, 
        'vehicles': {
            $elemMatch:{
                class: {
                    $regex : `.*${vehicle.substring(0, vehicle.lastIndexOf(' ')).toLowerCase()}.*`
                }, 
                vacant: {
                    $gt:0
                }
            }
        }
    }).exec(callback)

    
}

parkingSchema.methods.addNewParking = function(parking){
    this.name = parking.name;
    this.address = parking.address;
    this.location.coordinates = parking.location;
    this.vacant = parking.capacity;
    this.capacity = parking.capacity;

    this.save();
}

parkingSchema.methods.updateCapacity = (cap, id)=>{
    
    
}

parkingSchema.methods.bookParking = (id)=>{
    this.findOneAndUpdate({_id: id}, {$inc:{vacant:-1}})

}


parkingSchema.methods.vacantParking = ()=>{
    if(this.vacant < this.capacity){
        this.vacant++;
        this.save();
    }
}


var Parking = mongoose.model('Parking', parkingSchema);
module.exports = Parking;