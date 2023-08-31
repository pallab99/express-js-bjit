const path = require('path');
const fs = require('fs');
const databaseErrorHandler = (message) => {
    const filePath = path.join(__dirname, '..', 'server', 'error.log');
    fs.appendFileSync(filePath, message + '\n');
};

module.exports = databaseErrorHandler;