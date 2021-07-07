
'use strict'
const logClass= require('./log-classs');
var log;

module.exports.init = async function init (logServer, debug = false) {
    log = new logClass.log(logServer, debug);
    var result = await log.init();
    return (result);
}

module.exports.logger = async function logger (message) {
    try {
        var logResult = await log.sendLog(JSON.stringify(message));
        return logResult;
    }
    catch (e) {
        console.log("Error writing to logger");
        console.log(e.message);
        return e.message;
    }  
}

module.exports.disconnect = async function disconnect () {
    var result = await log.disconnect();
    return (result);
}


