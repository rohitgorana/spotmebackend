var mongoose  = require('mongoose')

module.exports = (function(){
    mongoose.connect('mongodb://rohitgorana:lustforlife@cluster0-shard-00-00-cncd3.mongodb.net:27017,cluster0-shard-00-01-cncd3.mongodb.net:27017,cluster0-shard-00-02-cncd3.mongodb.net:27017/spotme?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin')
      
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('Mongoose running');
    });
})();
