// There is no Database here

const workingStartTime = async function(req,res,next){
    if(!req.body.driverId){
        return res.status(400).json({Message : 'driverId is not be empty'});
    }
    next();
};

const workingFinishTime = async function(req,res,next){
    if(!req.body.driverId){
        return res.status(400).json({Message : 'driverId is not be empty'});
    }
    next();
};

const workingTime = async function(req,res,next){
    if(!req.body.driverId){
        return res.status(400).json({Message : 'driverId is not be empty'});
    }
    next();
};

const workingMoney = async function(req,res,next){
    if(!req.body.driverId){
        return res.status(400).json({Message : 'driverId is not be empty'});
    }
    next();
};

const breakTimeStart = async function(req,res,next){
    if(!req.body.driverId){
        return res.status(400).json({Message : 'driverId is not be empty'});
    }
    next();
};

const breakTimeFinish = async function(req,res,next){
    if(!req.body.driverId){
        return res.status(400).json({Message : 'driverId is not be empty'});
    }
    next();
};

module.exports ={
    workingStartTime,
    workingFinishTime,
    workingTime,
    workingMoney,
    breakTimeStart,
    breakTimeFinish
};