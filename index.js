
'use strict'
const logClass= require('./log-classs');
var log;

module.exports.init = async function init (logServer) {
    log = new logClass.log(logServer);
    var result = await log.init();
    return (result);
}

module.exports.logger = async function logger (message) {

    var logResult = await log.sendLog(JSON.stringify(message));
    return logResult;
}


