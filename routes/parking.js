var mongoose = require('mongoose')

var express = require('express');
var router = express.Router();
var parking = require('../models/parking')
var user = require('../models/user')
var authenticate = require('../core/auth')


router.post('/', authenticate, (req, res)=>{
    if(req.body.address){
      var Parking = new parking;
      Parking.addNewParking({
        name: req.body.name,
        address: req.body.address,
        location : [req.body.location.longitude, req.body.location.latitude]
      })
      console.log('Inserted parking adding reference to user...')
      user.findOneAndUpdate({username: res.locals.user.username},{
          $push:{
              accommodations : Parking._id
          }
      },{new: true}, function(err, user){
        var list = user.accommodations.map((accomodation)=>{
            parking.findOne({_id: accomodation._id}, (err, parkinglot)=>{
                return parkinglot
            })
        })
        res.json({success: true, parkings: list})
      })
      
    }
    else{
      res.json({success:false, message: 'Something went wrong!'});
    }
})

router.post('/vehicle', authenticate, (req, res) =>{
    user.findOne({username: res.locals.user.username, accommodations : req.body.parking}, (err, user)=>{
        if(err) console.log(err);
        if(!err && user){
            parking.findByIdAndUpdate(req.body.parking, {
                $push:{
                    vehicles : {
                        class : req.body.class,
                        capacity: req.body.capacity,
                        vacant: req.body.capacity,
                        rate: req.body.rate,
                        rateDuration: req.body.rateDuration
                    }
                }
            }, {new: true}, function(err, parking){
                if(err)
                    res.json({success: false, message: err})
                else
                    res.json({success: true, parking})
                
            })
        }
    })
})

router.get('/', authenticate, (req, res) => {
    user.findOne({username: res.locals.user.username}, function(err, user){
        if(err) console.log(err);
        if(!err && user){
            var accommodations = user.accommodations.map((item)=> mongoose.Types.ObjectId(item))
            
            parking.find({
                '_id':{
                    $in: accommodations
                }
            }, (err, list)=>{
                res.json({success: true, parkings: list})
            })

            
            
        }
    })
})
  
router.get('/nearby', authenticate, (req, res) => {
    parking.getSuggestion([req.query.lng, req.query.lat], res);
    
})

router.get('/test', authenticate, (req,res)=>{
    
    user.findOne({username: res.locals.user.username},(err, user)=>{
        res.json(user.accommodations);
    })
   
})



module.exports = router;