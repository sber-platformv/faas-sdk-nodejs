exports.handler = (req, res) => {
    console.log(`Request received: ${JSON.stringify(req.body)}\nMethod: ${req.method}`);
    res.status(200).send(`Hello from NodeJS function!\nYou said: ${JSON.stringify(req.body)}`);
};