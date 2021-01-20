const expect = require('chai').expect
const sinon = require('sinon');

const underTest = require('../../log-classs');

describe("Integration tests for connecting to the log queue", () => {
    it ("Connect command connects to the rabbit queue and returns true", async () => {
        var log = new underTest.log("amqp://127.0.0.1:5672");
        
        var result = await log.connect();

        expect(result).to.equal(true);

        await log.disconnect();
    })

    it ("Disconnects successfully from rabbit", async () => {
        var log = new underTest.log("amqp://127.0.0.1:5672");
        
        await log.connect();

        var result = await log.disconnect();

        expect(result).to.equal(true);
    })

    it ("Open a channel with the rabbit queue", async () => {
        var log = new underTest.log("amqp://127.0.0.1:5672");
        
        await log.connect();

        var result = await log.channel();
        expect(result).to.equal(true);

        await log.disconnect();

        
    })

    it ("Connected via init sequence", async () => {
        var log = new underTest.log("amqp://127.0.0.1:5672");
        
        var result = await log.init();
        expect(result).to.equal(true);

        await log.disconnect();

    })

    it ("Failed to connect to Rabbit MQ", async () => {
        var log = new underTest.log("amqp://128.0.0.1:5672");
        
        try {
            var result = await log.connect();
        }
        catch(e) {
            expect(e.message).to.equal('Connection failure')
        }
    })

    it ("Failed to connect to Rabbit MQ during init", async () => {
        var log = new underTest.log("amqp://128.0.0.1:5672");
        
        try {
            var result = await log.init();
        }
        catch(e) {
            expect(e.message).to.equal('Connection failure')
        }
    })
})