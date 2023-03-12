const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const { formatISO } = require('date-fns')

const logEvents = async (message, logFileName) => {
    const dateTime = formatISO(new Date())
    const logItem = `[${dateTime}]\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'log', 'error'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'log', 'error'), logItem)
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'log', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'error.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = { logEvents, logger }