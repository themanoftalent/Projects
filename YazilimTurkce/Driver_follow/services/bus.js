// All Database functions are here
const database = require('../models/database');

const bussAdd = async function(req,res){
    var check = await  new database.CRUD('driverfollow','driver').find({driverId:req.body.driverId});
    if(check){
        let buss = {
            buss_id: database.id(),
            driverId: req.body.driverId,
            plaka: req.body.plaka,
        };
        new database.CRUD('driverfollow','bus').insert(buss);
        return res.status(200).json({Message: 'added'});
    }
    else{
        return res.status(200).json({Message: 'didn\'t  add'});
    } 
};

const bussList = async function(req,res){
    var bussList = await new database.CRUD('driverfollow','driver').find({}, [0,10]);
    return res.json(bussList);
};

const bussUpdate = async function(req,res){
    var up = await new database.CRUD('driverfollow','bus').update(
        {driverId : req.body.driverId},
        {$set : {'plaka' : req.body.plaka}});
    if(up.modifiedCount == 0 ){
        return res.status(401).json({Message: 'modified Count = 0'});
    }
    else{
        return res.status(200).json({Message: 'update is right'});
    }
};
const bussDelete = async function(req,res){
    let dele = {
        buss_id: req.body.buss_id
    };
    var deleteCar = await  new database.CRUD('driverfollow','bus').delete(dele);
    if(deleteCar.result != 0){
        return res.status(200).json({Message: 'succesful'});
    }
    else{
        return res.status(401).json({Message: 'failed'});
    }
};



module.exports = {
    bussAdd,
    bussList,
    bussUpdate,
    bussDelete
};