var express = require('express')
var router = express.Router()
var models = require('../models')
var jwt = require('jsonwebtoken')
var config = require('../core/config');
var authenticate = require('../core/auth')
var vehicleRouter = require('./vehicle')
var parkingRouter = require('./parking')
var userRouter = require('./user')


router.use('/vehicle', vehicleRouter);
router.use('/parking', parkingRouter);
router.use('/user', userRouter);

router.post(
  '/auth',
  (req, res) =>  {
    models.user.findOne({
      username: req.body.username
      
    }, (err,user) => {
      if(err) throw err
      
      if(!user){
        res.json({success: false, message: 'User not found'})
      }else{
        
        if(req.body.password != user.password){
          res.json({success: false, message: 'Password is incorrect'})
        }
        else{
          const payload = {
            username : user.username
          }
          
          var token = jwt.sign(payload, config.secret, {
            expiresIn: 86400
          })
          
          res.json({
            success:true,
            message: 'Success',
            token: token,
            expiresIn: 86400
          })
          
        }
      }
    })
  }
)









module.exports = router;


