
'use strict'
const logClass= require('./log-classs');
let log;
let initialised = false;

module.exports.init = async function init (logServer, debug = false) {
    log = new logClass.log(logServer, debug);
    var result = await log.init();
    initialised = result;
    return (result);
}

module.exports.logger = async function logger (message) {
    let retries = 0;

    while(!initialised && retries++ < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    if(!initialised)
    {
        try {
            throw new Error('Connection to logger not initialised');
        }
        catch (e) {
            console.log("Error writing to logger");
            console.log(e.message);
            return e.message;
        }
    }
    
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


