const expect = require('chai').expect
const sinon = require('sinon');

const underTest = require('../../index');

describe("Integration tests for sending messages to the log queue", () => {
    it("Connect to the queue and disconnect", async () => {
        
        var result = await underTest.init("amqp://127.0.0.1:5672");
        
        expect(result).to.equal(true);

        var DC = await underTest.disconnect();
        expect(DC).to.equal(true);
    })

    it("Connect to the queue and send a message", async () => {
      await underTest.init("amqp://127.0.0.1:5672");
      
      var result = await underTest.logger("Test message");
      expect(result).to.equal("Log sent");

      var DC = await underTest.disconnect();
      expect(DC).to.equal(true);
    });

    it("Connects and successfully sends message without awaiting for connect", async () => {
    
      underTest.init("amqp://127.0.0.1:5672", true); 
      
      let result = await underTest.logger("Test message");

      expect(result).to.equal("Log sent");
      
      var DC = await underTest.disconnect();
      expect(DC).to.equal(true);
    });
})