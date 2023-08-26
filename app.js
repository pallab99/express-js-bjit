const express = require('express');
const server = express();
const bodyParser = require('body-parser');

const port = 8000;
const productRouter = require('./routes/products/index');
const { failure } = require('./common/response');
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));

//! api routes
server.use('/api', productRouter.router);

server.get('/', (req, res) => {
    res.status(200).json({
        success: 'true',
        message: 'This is the base route',
    });
});
server.use((req, res, next) => {
    res.status(500).json(failure("Can't find the route"));
});
server.listen(port, () => {
    console.log(`server started on port : ${port}`);
});
