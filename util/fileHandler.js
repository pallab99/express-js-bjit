const fsPromise = require('fs').promises;

const readFile = async (path) => {
    try {
        const data = await fsPromise.readFile(path, {
            encoding: 'utf8',
        });
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (error) {
        return error;
    }
};

const addDataToFile = async (path, req, res) => {
    try {
        const body = req.body;

        const result = await readFile(path);
        const newProduct = {
            id: result[result.length - 1].id + 1,
            ...body,
        };
        result.push(newProduct);
        await fsPromise.writeFile(path, JSON.stringify(result, 2, null));
        return { success: true, data: newProduct };
    } catch (error) {
        return { success: false, data: null };
    }
};
module.exports = { readFile, addDataToFile };
