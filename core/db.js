var mongoose  = require('mongoose')

module.exports = (function(){
    mongoose.connect('mongodb+srv://rohitgorana:brandnewday@cluster0-cncd3.mongodb.net/spotme')
      
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('Mongoose running');
    });
})();
