const express = require('express')
const router = express.Router()
const models = require('../models')
var config = require('../core/config');
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

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
        
        if(!bcrypt.compareSync(req.body.password, user.password)){
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


router.post(
  '/user',
  (req, res) => {
    if(req.body.username){
      var User = new models.user;
      User.addNewUser({
        username : req.body.username,
        password : bcrypt.hashSync(req.body.password, 10),
        name : {
          first : req.body.firstName,
          last : req.body.lastName
        }
      })

      res.status(200).send('Success');

    }
    else{
      res.status(401).send('Error')
    }
  }
)

router.post('/parking', (req, res)=>{
  if(req.body.address){
    var Parking = new models.parking;
    Parking.addNewParking({
      name: req.body.name,
      address: req.body.address,
      capacity : req.body.capacity,
      location : [req.body.lng, req.body.lat]
    })
    res.status(200).send('Success');
  }
  else{
    res.status(401).send('Error');
  }
})

router.use(function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token']

  if(token){
    jwt.verify(token, config.secret, function(err, decoded){
      if(err){
        return res.json({success:false, message: 'Failed to authenticate'})
      } else {
        req.decoded = decoded;
        next();
      }
    })
  } else {
    return res.status(403).send({
      success : false,
      message: 'Token Not Provided'
    })
  }

})

router.get('/logout', 
function(req, res){
  //TODO : logout
  res.redirect('/');
});

router.get('/parking', (req, res) => {
  models.parking.getSuggestion([req.query.lng, req.query.lat], res);
  
})

router.get('/users', (req, res) => {
  models.user.find({}, (err, users) => {
    res.json(users)
  })
})


module.exports = router;


