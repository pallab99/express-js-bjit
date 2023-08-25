const path = require('path');
const { success, failure } = require('../../common/response');
const readFile = require('../../util/readDatafromFile');

class Product {
    async getAll(req, res) {
        try {
            const data = await readFile(
                path.join(__dirname, '..', '..', 'data', 'manga.json')
            );
            res.status(200).json(success('Successfully get the data', data));
        } catch (error) {
            res.status(400).json(failure('Can not get the data'));
        }
    }

    async getDataById(req, res) {
        try {
            const result = await readFile(
                path.join(__dirname, '..', '..', 'data', 'manga.json')
            );
            const id = req.params.id;
            const filteredData = result.filter((ele) => {
                return ele.id === +id;
            });
            if (filteredData.length) {
                res.status(200).json(
                    success('Successfully get the data', filteredData[0])
                );
            } else {
                res.status(400).json(failure(`Id ${id} does not exist`));
            }
        } catch (error) {
            res.status(400).json(failure('Can not get the data'));
        }
    }
}

module.exports = Product;
