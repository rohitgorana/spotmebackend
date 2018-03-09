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
  user.findOneAndUpdate({username: res.locals.user.username}, {
    "$push" :{
      "vehicles" : {
        regNo : req.body.regNo,
        class: req.body.class,
        fuel: req.body.fuel,
        model: req.body.model
      }
    }
  }, (err, user)=>{
    if(err){
      res.json({success: false, message: err})
    }
    else{
      res.json({success: true})
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