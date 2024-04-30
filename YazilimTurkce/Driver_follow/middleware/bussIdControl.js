const database = require('../models/database');

function bussId(req,res,next){
    let Id = req.body.bussId;
    var asdf =  new database.CRUD('driverfollow','time').find({'driverId':Id});
    if(!asdf){
        return res.json('kullanıcı yok');
    }
    else{
        return next();
    }
}

module.exports = {
    bussId
};