var jwt = require('jsonwebtoken')
var config = require('./config')

module.exports = function(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token']
  
    if(token){
      jwt.verify(token, config.secret, function(err, decoded){
        if(err){
          return res.json({success:false, message: 'Failed to authenticate'})
        } else {
          res.locals.user = decoded;
          next();
        }
      })
    } else {
      return res.status(403).send({
        success : false,
        message: 'Token Not Provided'
      })
    }
  
}