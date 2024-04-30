const express = require('express');
const router = express.Router();

const bussC = require('../controllers/bus');
const bussS = require('../services/bus');

const tokenControl= require('../middleware/tokenControl');
const {roleControl} = require('../middleware/roleControl');


router.post('/bussAdd', tokenControl.tokenControl, roleControl, bussC.bussAdd, bussS.bussAdd);
router.post('/bussList',  bussS.bussList);
router.post('/bussUpdate',tokenControl.tokenControl, roleControl, bussS.bussUpdate);
router.post('/bussDelete',tokenControl.tokenControl, roleControl, bussS.bussDelete);


module.exports=router; //dışarı dosya alıp vermek için lazım