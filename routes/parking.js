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
        location : [req.body.lng, req.body.lat]
      })
      console.log('Inserted parking adding reference to user...')
      user.findOneAndUpdate({username: res.locals.user.username},{
          $push:{
              accommodations : Parking._id
          }
      },{new: true}, function(err, user){
          res.status(200).send("Success");
      })
      
    }
    else{
      res.status(401).send('Error');
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
                if(err) console.log(err);
                res.json(parking)
                
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