const database = require('../models/database');

function driverId(req,res,next){
    let Id = req.body.driverId;
    var asdf =  new database.CRUD('driverfollow','time').find({'driverId':Id});
    if(!asdf){
        return res.status(403).json({Message: 'kullanıcı yok'});
    }
    else{
        return next();
    }
}

module.exports = {
    driverId
};