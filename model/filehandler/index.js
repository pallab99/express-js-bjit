const path = require('path');
const generateSecretToken = require('../../util/tokenGenerator');
const generateVerificationCode = require('../../util/generateVerificationCode');
const sendVerificationEmail = require('../../util/nodeMailer');

const fsPromise = require('fs').promises;

class FileHandlerModel {
    readFile = async (path) => {
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

    addDataToFile = async (path, req, res) => {
        try {
            const body = req.body;
            if (req.url === '/signUp') {
                const { email } = req.body;
                const token = generateSecretToken(body);
                const verificationCode = generateVerificationCode();
                await sendVerificationEmail(email, verificationCode);
                body.token = token;
                body.verificationCode = verificationCode;
                body.isVerified = false;
            }
            const result = await this.readFile(path);
            console.log(req.url);
            if (req.url === '/create') {
                body.user.id = result[result.length - 1].id + 1;
            }
            const newData = {
                id: result[result.length - 1].id + 1,
                ...body,
            };
            result.push(newData);
            await fsPromise.writeFile(path, JSON.stringify(result, 2, null));
            return { success: true, data: newData };
        } catch (error) {
            return { success: false, data: null };
        }
    };

    deleteData = async (path, req, res) => {
        try {
            const result = await this.readFile(path);
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
    updateData = async (path, req, res) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const { email, verificationCode } = req.body;

            const result = await this.readFile(path);
            if (req.url === '/verifyCode') {
                const index = result.findIndex(
                    (ele) =>
                        ele.email === email &&
                        ele.verificationCode === verificationCode
                );
                if (index != -1) {
                    result[index].isVerified = true;
                    await fsPromise.writeFile(path, JSON.stringify(result));
                    return { success: true, data: result };
                } else {
                    return { success: false };
                }
            } else {
                const index = result.findIndex((ele) => ele.id === +id);
                if (index != -1) {
                    result[index] = { ...result[index], ...body };
                    await fsPromise.writeFile(path, JSON.stringify(result));
                    return { success: true, data: result };
                } else {
                    return { success: false };
                }
            }
        } catch (error) {
            return { success: false, data: null };
        }
    };
}

module.exports = new FileHandlerModel();
