const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 8000;
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');
const userRouter = require('./routes/users/');

const { failure, success } = require('./common/response');

//! Middleware
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(morgan('tiny'));

//! Logger
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'log', 'log.log'),
    { flags: 'a' }
);
server.use(
    morgan(':method :url :status :res[content-length] - :response-time ms ', {
        stream: accessLogStream,
    })
);

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
