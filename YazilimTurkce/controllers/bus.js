// There is no Database here

const bussAdd = async function(req,res,next){
    let myBody = {};
    if(!req.body.driverId) {
        return res.status(404).json({status: false});
    }
    if(!req.body.plaka){
        return res.status(404).json({status: false});
    }
    
    myBody.driverId = req.body.driverId.toString();
    myBody.plaka = req.body.plaka.toString();
    
    req.body = myBody;
    next();
};

module.exports ={
    bussAdd
};