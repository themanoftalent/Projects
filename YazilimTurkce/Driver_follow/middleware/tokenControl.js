var jwt = require('jsonwebtoken');

function tokenControl(req, res, next) {
    var useToken = req.body.token;
    if(useToken == null && useToken.length < 2 ){
        return res.json(false);
    }
    else{
        jwt.verify(useToken, 'asdf', function(err, decoded) { // asdf ayni olmalı 
            if(err){ //err verirse yapılacaklar 
                return res.json('jwt expired'); // tokenin süresi dolduğunu söylüyor
            }
            return decoded;
        });
        return next();

    }
}

module.exports = {
    tokenControl
};