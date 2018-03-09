var express = require('express');
var router = express.Router();
var user = require('../models/user')
var authenticate = require('../core/auth')


router.post('/', (req, res) => {
    if(req.body.username){
        var User = new user;
        User.addNewUser({
          username : req.body.username,
          password : req.body.password,
          name : {
            first : req.body.firstName,
            last : req.body.lastName
          }
        })
  
        res.json({success: true});
  
      }
      else{
        res.json({success:false, message: "Something went wrong!"});
      }
    }
)


router.post('/vehicle', authenticate, (req, res)=>{
    user.findOneAndUpdate({username: res.locals.user.username}, {
        $push:{
            vehicles: {
                regNo:{
                    code: req.body.code,
                    number: req.body.number
                },
                class: req.body.class,
                fuel: req.body.fuel,
                model: req.body.model
            }
        }
    }, {new: true}, function(err, user){
        if(err)
            res.json({success:false, message:err})
        else
            res.json({success:true, user})
    })
})

module.exports = router;