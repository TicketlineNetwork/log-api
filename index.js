
'use strict'
const logClass= require('./log-classs');

module.exports.logApi = class logApi {
    constructor(logServer) {
        this.log = new logClass.log(logServer);
        this.log.init();
        this.logger = this.logger.bind(this);
    }

    async logger (message) {

        let logResult = "";
    
        if (!this.log.connected) {
            let init = await this.log.init();  

            if (init)
            {
                logResult = await this.log.sendLog(message);
            }
            else {
                logResult = "Cannot connect to logging system";
            }
        } 
        else {
            logResult = await this.log.sendLog(message);
        }
    
        return logResult;
    }
}


