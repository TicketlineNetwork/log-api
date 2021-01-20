const expect = require('chai').expect
const sinon = require('sinon');

const underTest = require('../../index');
const logClass = require('../../log-classs');



describe("Unit tests for sending messages to the log queue", () => {

    afterEach(function () {
        sinon.restore();
    });

    it ("Connect to the queue and post a message", async () => {
        
        sinon.stub(logClass.log.prototype, 'init').resolves(true);
        sinon.stub(logClass.log.prototype, 'sendLog').resolves("Log sent");

        let log = new underTest.logApi();

        var result = await log.logger("Send Test Message");
        
        expect(result).to.equal("Log sent");
    })

    it ("Can't connect to post a message", async () => {
        
        sinon.stub(logClass.log.prototype, 'init').resolves(false);
        sinon.stub(logClass.log.prototype, 'sendLog').resolves("Log sent");

        let log = new underTest.logApi();

        var result = await log.logger("Send Test Message");
        
        expect(result).to.equal("Cannot connect to logging system");
    })

    it ("Connected but message send fails", async () => {
        
        sinon.stub(logClass.log.prototype, 'init').resolves(true);
        sinon.stub(logClass.log.prototype, 'sendLog').resolves("Log failed to send");

        let log = new underTest.logApi();

        var result = await log.logger("Send Test Message");
        
        expect(result).to.equal("Log failed to send");
    })
})