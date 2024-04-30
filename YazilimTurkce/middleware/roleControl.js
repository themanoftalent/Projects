var jwt = require('jsonwebtoken');

function roleControl(req,res,next){
    var useToken = req.body.token;
    let user = jwt.verify(useToken, 'asdf', function(err, decoded){
        return decoded;
    });
    if(user.role != 'admin'){
        return res.json('yetkiniz yok');
    }
    else{
        return next();
    }
}

module.exports = {
    roleControl
};