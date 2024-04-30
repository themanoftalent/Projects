// There is no Database here


const register = async function(req,res,next){
    if(!req.body.name){
        return res.status(400).json({Message : 'name is not be empty'});
    }
    if(!req.body.surname){
        return res.status(400).json({Message : 'surname is not be empty'});
    }
    if(!req.body.password){
        return res.status(400).json({Message : 'password is not be empty'});
    }
    if(!req.body.role){
        return res.status(400).json({Message : 'role is not be empty'});
    }
    next();
};

const login = async function(req,res,next){
    let checkUser = req.body;
    if(Object.keys(checkUser).length < 2 ){
       
        return res.status(401).json({status:false});
    }
    next();
};

const updatee = async function(req,res,next){
    
    if(!req.body.driverId){
        return res.status(400).json({Message : 'driverId is not be empty'});
    }
    next();
};

const deletee = async function(req,res,next){
    if(!req.body.driverId){
        return res.status(400).json({Message : 'driverId is not be empty'});
    }
    next();
};

module.exports = {
    register,
    login,
    updatee,
    deletee
};