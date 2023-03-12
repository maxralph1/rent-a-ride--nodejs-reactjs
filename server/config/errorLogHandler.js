const { formatISO } = require('date-fns')
const { logEvents } = require('./errorLogger')

const logErrorHandler = (err, req, res, next) => {
    const dateTime = formatISO(new Date())

    logEvents(`${err.name} - ${err.message}: ${req.url}\t - - [${dateTime}] ${req.method} ${req.headers.origin}`, 'error.log')
    console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500

    res.status(status)

    res.json({ message: err.message, isError: true })
}

module.exports = logErrorHandler