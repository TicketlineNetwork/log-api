'use strict'
const amqp = require('amqplib/callback_api');

class log {
    pubConnection;
    pubChannel;
    connected = false;
    channelCreated = false;
    constructor(logServer) {
        this.logServer = logServer;
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.channel = this.channel.bind(this);
        this.init = this.init.bind(this);
        this.sendLog = this.sendLog.bind(this);
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
                this.pubChannel.publish('logs', '', Buffer.from(message));
                console.log('[*] Published message to exchange');
                resolve("Log sent");
            }
            catch (e) {
                console.log(e.message);
                reject(new Error("Log send failed"));
            }           
        })
    }
}

module.exports.log = log;