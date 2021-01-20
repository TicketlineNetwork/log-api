const expect = require('chai').expect
const sinon = require('sinon');

const underTest = require('../../index');
const log = new underTest.logApi("amqp://127.0.0.1:5672")


describe("Integration tests for sending messages to the log queue", () => {
    it ("Connect to the queue and post a message", async () => {
        
        var result = await log.logger("Send Test Message");
        
        expect(result).to.equal("Log sent");

        var DC = await log.log.disconnect();
    })
})