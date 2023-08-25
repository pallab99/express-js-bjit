const express = require('express');

const server = express();
const bodyParser = require('body-parser');

const port = 8000;
const productRouter = require('./routes/products/index');
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));

//! api routes
server.use('/api', productRouter.router);

server.get('/', (req, res) => {
    res.json({
        success: 'true',
        message: 'This is the base route',
    });
});

server.listen(port, () => {
    console.log(`server started on port : ${port}`);
});
