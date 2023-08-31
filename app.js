const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');
const userRouter = require('./routes/users');

const dotEnv = require('dotenv');
dotEnv.config();

const port = process.env.PORT;
const { failure, success } = require('./common/response');
const connectDB = require('./configs/databaseConnection');

//! Middleware
server.use(cors({ origin: '*' }));
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(morgan('tiny'));

const logStream = {
    write: (message) => {
        fs.appendFile(
            path.join(__dirname, 'server', 'log.log'),
            message,
            (err) => {
                if (err) {
                    console.error('Error appending to log file:', err);
                }
            }
        );
    },
};
server.use(
    morgan(':method :url :status :res[content-length] - :response-time ms ', {
        stream: logStream,
    })
);
//! Invalid json handler
server.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    next();
});
//! api routes
server.use('/api/products', productRouter.router);
server.use('/api/orders', orderRouter.router);
server.use('/api/users', userRouter.router);

server.get('/', (req, res) => {
    res.status(200).json(success('This is the base route'));
});
server.use((req, res, next) => {
    res.status(500).json(failure("Can't find the route"));
});

connectDB(() => {
    server.listen(port, () => {
        console.log(`server started`);
    });
});
