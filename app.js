const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 8000;

const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');
const userRouter = require('./routes/users/');

const { failure, success } = require('./common/response');
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
//! api routes
server.use('/api', productRouter.router);
server.use('/api', orderRouter.router);
server.use('/api', userRouter.router);

server.get('/', (req, res) => {
    res.status(200).json(success('This is the base route'));
});
server.use((req, res, next) => {
    res.status(500).json(failure("Can't find the route"));
});
server.listen(port, () => {
    console.log(`server started on port : ${port}`);
});
