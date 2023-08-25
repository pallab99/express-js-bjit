const fsPromise = require('fs').promises;
const readFile = async (path) => {
    const data = await fsPromise.readFile(path, {
        encoding: 'utf8',
    });
    const jsonData = JSON.parse(data);
    return jsonData;
};

module.exports = readFile;
