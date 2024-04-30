const express = require('express');
const router = express.Router();

const control = require('../middleware/driverIdControl');
const bussId = require('../middleware/bussIdControl');

//const operationC = require('../controllers/operation');
const operationS = require('../services/operation');


router.post('/workingStartTime',control.driverId, bussId.bussId, operationS.workingStartTime);
router.post('/workingFinishTime',control.driverId, bussId.bussId, operationS.workingFinishTime);
router.post('/workingTime',operationS.workingTime);
router.post('/workingMoney',operationS.workingMoney);
router.post('/breakTimeStart',control.driverId, bussId.bussId, operationS.breakTimeStart);
router.post('/breakTimeFinish',control.driverId, bussId.bussId, operationS.breakTimeFinish);
router.post('/exchange', operationS.exchange);
//router.post('/upload', operationS.upload);


module.exports=router; //dışarı dosya alıp vermek için lazım