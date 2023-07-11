require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileupload = require('express-fileupload'); 
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const dbConnection = require('./config/dbConnect');
const PORT = process.env.PORT || 5000;


app.use(helmet());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

let accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log/access')
})
app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status ":res[content-length] - :response-time ms" ":referrer" ":user-agent"', { stream: accessLogStream }))

dbConnection();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors(corsOptions));
app.use(cookieParser());
app.use(fileupload({useTempFiles: true}));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/api', express.static(path.join(__dirname, 'public')));

app.use('/api/v1', require('./routes/api'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.ejs'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    };
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Database connection established');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err);
});