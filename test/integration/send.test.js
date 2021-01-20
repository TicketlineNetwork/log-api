const expect = require('chai').expect
const sinon = require('sinon');

const underTest = require('../../log-classs');

describe("Integration tests for sending messages to the log queue", () => {
    it ("Connect to the queue and post a message", async () => {
        var log = new underTest.log("amqp://127.0.0.1:5672");
        
        await log.init();

        var result = await log.sendLog("Test message");
        expect(result).to.equal("Log sent");

        await log.disconnect();
    })

    it ("Failed to send message to queue", async () => {
        var log = new underTest.log("amqp://127.0.0.1:5672");
        
        await log.connect();

        try {
            var result = await log.sendLog("Test message");
        }
        catch (e) {
            expect(e.message).to.equal("Log send failed");
        }

        await log.disconnect();
    })
})