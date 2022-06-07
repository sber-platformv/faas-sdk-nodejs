const sinon = require("sinon");
const assert = require("assert");
const { handler } = require("../handlers/handler");

test("Function test", () => {
    // Mock ExpressJS 'req' and 'res' parameters
    const req = {
        body: "Hi from function!"
    };
    const res = {
        send: sinon.stub(),
        status: function (s) {
            this.statusCode = s;
            return this;
        }
    };

    // Call function
    handler(req, res);

    const expectedResponse = `Hello from NodeJS function!\nYou said: ${JSON.stringify(req.body)}`;

    assert.ok(res.send.calledOnce);
    assert.deepStrictEqual(res.send.firstCall.firstArg, expectedResponse);
});
