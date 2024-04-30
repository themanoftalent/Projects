const express = require('express');
const router = express.Router();

const driverC = require('../controllers/driver');
const driverS = require('../services/driver');
const { tokenControl } = require('../middleware/tokenControl');
const { roleControl } = require('../middleware/roleControl');
//const { driverId } = require('../middleware/driverIdControl');


router.post('/register',driverC.register,driverS.register);
router.post('/login', driverC.login, driverS.login);
router.post('/driverList',tokenControl, roleControl, driverS.driversList);
router.post('/role',tokenControl,roleControl,driverS.admin);
router.post('/driverOne', driverS.driverOne);
router.post('/driverUpdate', tokenControl, roleControl, driverC.updatee,driverS.updatee);
router.post('/delete',tokenControl, roleControl,  driverC.deletee, driverS.deletee);

module.exports=router; //dışarı dosya alıp vermek için lazım