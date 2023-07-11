// const express = require('express');
// const app = express();
// const morgan = require('morgan');
// const path = require('path');
// const rfs = require('rotating-file-stream');


const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // if Mongoose not found error, set to 404 and change message
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // let errorLogStream = rfs.createStream('error.log', {
    //     interval: '1d', // rotate daily
    //     path: path.join(__dirname, '../log/error')
    // })

    // app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status ":res[content-length] - :response-time ms" ":referrer" ":user-agent"', { stream: errorLogStream }))

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};


module.exports = errorHandler;