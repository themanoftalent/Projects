const moment = require('moment-timezone');

/**
 * get timestamp
 * 
 * @returns {Number}
 */
module.exports.timestamp = () => {
    return parseInt(moment().utcOffset(0, false).format('X'), 10);
};

/**
 * get timestamp
 * 
 * @returns {Number}
 */
module.exports.timestampX = () => {
    return parseInt(moment().utcOffset(3, false).format('x'), 10);
};

module.exports.dateTime = (date, format, TZ = 0) => {
    return moment(date).utcOffset(TZ, false).format(format);
};

/**
 * Moment Object
 * 
 * @returns {}
 */
module.exports.date = (timestamp) => {
    return moment.unix(timestamp).utcOffset(3, false).format('HH:mm');
};
/**
 * Moment Object
 * 
 * @returns {}
 */
module.exports.days = (times) => {
    return moment.unix(times).utcOffset(3, false).format('YYYY-MM-DD');
};

/**
 * Moment Object
 * 
 * @returns {}
 */
module.exports.dateToTimestamp = (date) => {
    return moment(date).format('X');
};

/**
 * get timestamp
 * 
 * @returns {Number}
 */
module.exports.cron_close_timeToTimestamp = (cron_close_time) => {
    let time = this.moment().format('YYYY-MM-DDT');
   
    return parseInt(moment(time + '' + cron_close_time).utcOffset(0, false).format('X'), 10);
};


/**
 * get timestamp MS
 * 
 * @returns {Number}
 */
module.exports.timestampMS = () => {
    return parseInt(moment().utcOffset(0, false).format('x'), 10);
};

/**
 * Moment Object
 * 
 * @returns {}
 */
module.exports.moment = () => {
    return moment().utcOffset(0, false);
};

module.exports.isValid = (date, format = 'YYYYMMDD') => {
    return moment(date, format, true).utcOffset(0, false).isValid();
};