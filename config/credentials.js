const origins = require('./allowedOrigins');


const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (origins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}


module.exports = credentials;