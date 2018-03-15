var express = require('express');
var router = express.Router();
var vehicle = require('../models/vehicle')
var user = require('../models/user')
var authenticate = require('../core/auth')


router.get('/classes', (req, res)=>{
    vehicle.vehicleClass.find({}, (err, classes) =>{
      res.json(classes.map((value)=>value.name));
    })
})

router.get('/info', authenticate, (req, res) => {
    vehicle.getinfo(req.query.no1, req.query.no2, (info) => {
      res.json(info)
    });
})

router.post('/', authenticate, (req,res) =>{
  console.log(req.body)
  user.findOneAndUpdate({username: res.locals.user.username}, {
    "$push" :{
      "vehicles" : {
        regNo : req.body.regNo,
        class: req.body.class,
        fuel: req.body.fuel,
        model: req.body.model
      }
    }
  },{
    new: true,
    fields: {vehicles:1}
  }, (err, user)=>{
    if(err){
      res.json({success: false, message: err})
    }
    else{
      res.json({success: true, vehicles: user.vehicles})
    }
  })
})

router.get('/', authenticate, (req,res)=>{
  user.findOne({username:res.locals.user.username}, (err, user) => {
    if(err) console.log(err);
        if(!err && user){
          res.json({success: true, vehicles: user.vehicles})
        }
  })
})

router.delete('/', authenticate, (req,res) => {
  user.findOneAndUpdate({username:res.locals.user.username}, {
    "$pull" :{
      "vehicles" : {
        _id : req.body.vehicleId
      }
    }
  })
})

module.exports = router;