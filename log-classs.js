'use strict'
const amqp = require('amqplib/callback_api');

async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

class log {
    pubConnection;
    pubChannel;
    connected = false;
    channelCreated = false;
    debugMode = false;
    constructor(logServer, debug = false) {
        this.logServer = logServer;
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.channel = this.channel.bind(this);
        this.init = this.init.bind(this);
        this.sendLog = this.sendLog.bind(this);
        this.debugMode = debug;
    }

    connect() {
        return new Promise((resolve, reject) => {
            amqp.connect(this.logServer, function(error0, connection) {
                if (error0) {
                    console.log("Connection to RabbitMQ error : " + error0)
                    reject(new Error("Connection failure"));
                }
                else {
                    this.pubConnection = connection;
                    resolve(true);
                }                
            }.bind(this))
        })
    }

    channel () {
        return new Promise((resolve, reject) => {
            this.pubConnection.createChannel(function (error1, channel) {
                if (error1) {
                    console.log("RabbitMQ channel error : Logging Module : " + error1)
                    reject(new Error("Channel Failure"));
                }
                else {
                    this.pubChannel = channel;
                    resolve(true);
                }    
            }.bind(this))
        })
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            this.pubConnection.close(function (err, done) {
                if (err) {
                    console.log("RabbitMQ channel closing error : " + err)
                    reject(false);
                }
                else {           
                    resolve(true);
                }
            }.bind(this));
        });
    }

    async init() {

        return new Promise(async (resolve, reject) => {

            try {
                this.connected = await this.connect()
                this.channelCreated = await this.channel();
                resolve(true);
            }
            catch(e)
            {
                reject(e);
            }
        })       
    }

    sendLog (message) { 
        return new Promise(async (resolve, reject) => {
            try {
                let timeLoop = 0;
                while(!this.channelCreated) {
                    timeLoop += 1;
                    await sleep(1000);

                    if (this.debugMode)
                        console.log("Channel loop");

                    if (this.channelCreated)
                        break;
                    
                    console.log(timeLoop);
                }

                this.pubChannel.publish('logs', '', Buffer.from(message));
                if (this.debugMode)
                    console.log('[*] Published message to exchange');
                resolve("Log sent");
            }
            catch (e) {
                console.log("error on sendLog: ", e.message, this.pubConnection, this.pubChannel);
                if( !this.pubConnection || !this.pubChannel ) {
                    try {
                      this.init();
                    } catch(e) {
                        console.log("error on reinit: ", e.message)
                    }
                }
                reject(new Error(e.message));
            }           
        })
    }
}

module.exports.log = log;