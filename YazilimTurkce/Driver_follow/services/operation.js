// All Database functions are here

const database = require('../models/database');
const time = require('../helpers/date');
const axios = require('axios');

const workingStartTime = async function(req,res){
    try {
        let Id = req.body.driverId;
        var day = time.days(time.timestamp());
        var asdf = await new database.CRUD('driverfollow','time').find({'driverId':Id, 'dayss':day});
        if( asdf[0] &&  asdf[0].finishh == 0 ){
            return res.status(403).json({Message: 'yeniden giriş yapamazsınız'});
        }
        if(asdf[0] && time.days(asdf[0].startt) == time.days(time.timestamp())){
            return res.status(403).json({Message: 'aynı gün içinde iki kere giriş yapılamaz'});
        }
        if(time.date(time.timestamp()) < '09:00'){
            return res.status(403).json({Message: 'Game Over! Turn Your Village'});
        }
        var start = time.timestamp();
        var finish = 0;
        var breakStart = 0;
        var breakFinish = 0;
        var tarih = time.dateTime(); 
        var days = time.days(time.timestamp());
        var ekle = {
            driverId : req.body.driverId,
            startt : start,
            finishh : finish,
            breakStartt : breakStart,
            breakFinishh : breakFinish,
            tarihh : tarih,
            dayss : days
        };
        new database.CRUD('driverfollow','time').insert(ekle);
        return res.status(200).json({Message: 'added'});
    } catch (error) {
        return res.json(error);
    }
};
const workingFinishTime = async function(req,res){
    try {
        let Id = req.body.driverId;
        var day = time.days(time.timestamp()); 
        var asdf = await new database.CRUD('driverfollow','time').find({'driverId':Id , 'dayss': day});
        if( asdf[0].breakStartt == 0 || asdf[0].startt == 0  || asdf[0].breakFinishh == 0){
            return res.status(403).json({Message: 'Didn\'t add'});
        }
        var finish = time.timestamp();
        new database.CRUD('driverfollow','time').update(
            {driverId: req.body.driverId, dayss: day},
            {$set: {'finishh': finish}}
        );
        return res.status(200).json({Message: 'added'});
    } catch (error) {
        return res.json(error);
    }
};
const workingTime = async function(req,res){
    try {
        let Id = req.body.driverId;
        var day = time.days(time.timestamp());
        var asdf = await new database.CRUD('driverfollow','time').find({'driverId':Id, 'dayss': day});
    
        if(asdf[0].startt == 0 || asdf[0].finishh == 0){
            return res.status(403).json({Message: 'Start Didn\'t add'});
        }
        else{
            var workStart = asdf[0].startt;
            var workFinish = asdf[0].finishh;
            var breakStart = asdf[0].breakStartt;
            var breakFinish = asdf[0].breakFinishh;
            var result = workFinish - workStart;
            var breakResult = breakFinish - breakStart;
            let End = result - breakResult;
            if(End > 32){
                return res.json(End + ' saniye' + ' (9 saatin üzerindeki mesailere ücret ödenmeyecektir)');
            }
            else{
                return res.json(End + ' saniye');
            }
        }
    } catch (error) {
        return res.json(error);
    }
    
};

const workingMoney = async function(req,res){
    try {
        let Id = req.body.driverId;
        var day = time.days(time.timestamp()); 
        var asdf = await new database.CRUD('driverfollow','time').find({'driverId':Id, 'dayss': day});
        //time.days(asdf[0].startt)
        if(asdf[0].startt == 0 || asdf[0].finishh == 0){
            return res.json('Start Didn\'t add');
        }
        else{
            var workStart = asdf[0].startt;
            var workFinish = asdf[0].finishh;
            var breakStart = asdf[0].breakStartt;
            var breakFinish = asdf[0].breakFinishh;
            var result = workFinish - workStart;
            var breakResult = breakFinish - breakStart;
            let End = result - breakResult;
            let end = (End * (0.02257) + ' tl');
            return res.json(end);
        }
    } catch (error) {
        return res.json(error);
    }
};

const breakTimeStart = async function(req,res){
    try {
        let Id = req.body.driverId;
        var day = time.days(time.timestamp());
        var asdf = await new database.CRUD('driverfollow','time').find({'driverId':Id,'dayss': day});
        if(asdf[0].startt == 0 || asdf[0].breakStart != 0){
            return res.status(403).json({Message: 'Start Didn\'t add'});
        }
        var start = time.timestamp();
        new database.CRUD('driverfollow','time').update(
            {driverId: req.body.driverId, dayss: day},
            {$set: {'breakStartt': start}}
        );
        return res.json('added');
    } catch (error) {
        return res.json(error);
    }
};

const breakTimeFinish = async function(req,res){
    try {
        let Id = req.body.driverId;
        var day = time.days(time.timestamp());
        var asdf = await new database.CRUD('driverfollow','time').find({'driverId':Id,'dayss': day});
        if(asdf[0].startt == 0 || asdf[0].breakStartt == 0 ){
            return res.json('Start Didn\'t add');
        }
        else{
            var finish = time.timestamp();
            new database.CRUD('driverfollow','time').update(
                {driverId: req.body.driverId, dayss : day},
                {$set: {'breakFinishh': finish}}
            );
            return res.json('added');
        }
    } catch (error) {
        return res.json(error);
    }
};

const exchange = async function(req,res){
    try {
        const url= 'https://finans.truncgil.com/today.json';
        const response = await axios.get(url);
        var brm = req.body.birim;
        for (const key in response.data) {
            if(key === brm) {
                var Currency = response.data[key].Satış;
                console.log(Currency);
            }
        }
        let Id = req.body.driverId;
        var day = time.days(time.timestamp());
        var asdf = await new database.CRUD('driverfollow','time').find({'driverId':Id, 'dayss': day});
        if(asdf[0].startt == 0 || asdf[0].finishh == 0){
            return res.json('Start Didn\'t add');
        }
        else{
            var workStart = asdf[0].startt;
            var workFinish = asdf[0].finishh;
            var breakStart = asdf[0].breakStartt;
            var breakFinish = asdf[0].breakFinishh;
            var result = workFinish - workStart;
            var breakResult = breakFinish - breakStart;
            let End = result - breakResult;
            let end = (End * (0.02257));
            var addd =parseFloat(Currency.replace(',','.'));
            return res.json(end * addd);
        }   
    } catch (error) {
        return res.json(error);
    }
};
/*const benzin = async function(req,res){
    var options = {
        'method': 'GET',
        'hostname': 'api.collectapi.com',
        'port': null,
        'path': '/gasPrice/turkeyDiesel?district=kadikoy&city=istanbul',
        'headers': {
            'content-type': 'application/json',
            'authorization': 'apikey your_token'
        }
    };
    const response = await axios.request(options);
    console.log(response.data); 

    axios.get(url)
        .then (response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
};*/

/*const upload = async function(req,res){
    const image = req.files;
    const uploadPath = __dirname + '/'+ image.car.name;
    //__dirname = bulunduğun klasör
    image.car.mv(uploadPath, function (err) {
        if (err) {
            console.log(err);
            return res.send('Failed !!');
        }
    });
    if(image){
        return res.json('ok');
    }
};*/

module.exports ={
    workingStartTime,
    workingFinishTime,
    workingTime,
    workingMoney,
    breakTimeStart,
    breakTimeFinish,
    exchange
};