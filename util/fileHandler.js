const path = require('path');
const generateSecretToken = require('./tokenGenerator');

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
        if (req.url === '/users/signUp') {
            const token = generateSecretToken();
            body.token = token;
        }
        const result = await readFile(path);
        const newData = {
            id: result[result.length - 1].id + 1,
            ...body,
        };
        result.push(newData);
        await fsPromise.writeFile(path, JSON.stringify(result, 2, null));
        return { success: true, data: newData };
    } catch (error) {
        console.log(error);
        return { success: false, data: null };
    }
};

const deleteData = async (path, req, res) => {
    try {
        const result = await readFile(path);
        const id = req.params.id;

        const index = result.findIndex((ele) => ele.id === +id);
        if (index != -1) {
            const filteredData = result.filter((ele) => {
                return ele.id != id;
            });
            await fsPromise.writeFile(path, JSON.stringify(filteredData));
            return { success: true, data: filteredData };
        } else {
            return { success: false };
        }
    } catch (error) {
        return { success: false, data: null };
    }
};
const updateData = async (path, req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const result = await readFile(path);
        const index = result.findIndex((ele) => ele.id === +id);
        if (index != -1) {
            result[index] = { ...result[index], ...body };
            await fsPromise.writeFile(path, JSON.stringify(result));
            return { success: true, data: result };
        } else {
            return { success: false };
        }
    } catch (error) {
        return { success: false, data: null };
    }
};
module.exports = { readFile, addDataToFile, deleteData, updateData };
