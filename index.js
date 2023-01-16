
'use strict'
const logClass= require('./log-classs');
const ping = require('ping');
let log;
let logServer;
let initialised = false;
let connected = false;
let reinitialising = false;

module.exports.init = async function init (_logServer, debug = false) {
    logServer = _logServer;
    log = new logClass.log(logServer, debug);
    
    try { connected = await log.init();}
    catch (e) { console.log("Error initialising connection to logger \n" + e.message) }

    if(connected)
        initialised = true;

    return (connected);
}

async function reInit () {
    let loggers = ['event-logger', 'detail-logger', 'debug-logger'];
    let loggersAlive = false;
    reinitialising = true;

    console.log("Reinitialising connection to logger")

    while(!loggersAlive) {
        loggersAlive = true;
        console.log("Awaiting logger")
        
        for(let logger of loggers){
            let res = await ping.promise.probe(logger);
            if(!res.alive)
                loggersAlive = false
        }
    }     

    log = new logClass.log(logServer, false);

    try { connected = await log.init();}
    catch (e) { console.log("Error initialising connection to logger \n" + e.message) }

    if(!connected) {
        await new Promise(resolve => setTimeout(resolve, 10000))
        reInit()
    }

    if(connected) {
        reinitialising = false;
        console.log("Reinitialised connection to logger")
    }

    return (connected);
}

module.exports.logger = async function logger (message) {
    let retries = 0;


    while(!connected && retries++ < 10) {
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    if(!connected)
    {
        let message;

        if(!initialised)
            message = "Connection not initialised"; 

        if(initialised && !connected)
            message = "Connection lost"; 

        return message;
    }
    
    try {
        let logResult = await log.sendLog(JSON.stringify(message));
        return logResult;
    }
    catch (e) {
        console.log("Error writing to logger \n" + e.message);

        if(initialised && connected)
        {
            connected = false;
            try { await log.disconnect() }
            catch (e) { }
        }

        if(initialised && !reinitialising)
           reInit();

        return e.message;
    }  
}


module.exports.disconnect = async function disconnect () {
    var result = await log.disconnect();
    return (result);
}


