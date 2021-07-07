const expect = require('chai').expect
const sinon = require('sinon');

const underTest = require('../../log-classs');

describe("Integration tests for sending messages to the log queue direct via log class", () => {
    it ("Connect to the queue and post a message", async () => {
        var log = new underTest.log("amqp://127.0.0.1:5672");
        
        await log.init();

        var result = await log.sendLog("Test message");
        expect(result).to.equal("Log sent");

        await log.disconnect();
    })
})