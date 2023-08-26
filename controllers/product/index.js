const path = require('path');
const { success, failure } = require('../../common/response');
const { readFile, addDataToFile } = require('../../util/fileHandler');
const validateProductsBeforeAdd = require('../../util/productValidator');

class Product {
    async getAll(req, res) {
        try {
            const data = await readFile(
                path.join(__dirname, '..', '..', 'data', 'products.json')
            );
            res.status(200).json(success('Successfully get the data', data));
        } catch (error) {
            res.status(400).json(failure('Can not get the data'));
        }
    }

    async getDataById(req, res) {
        try {
            const result = await readFile(
                path.join(__dirname, '..', '..', 'data', 'products.json')
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

    async addData(req, res) {
        try {
            const validateProducts = validateProductsBeforeAdd(req);
            if (!validateProducts.success) {
                res.status(400).json(
                    failure('Can not add products', validateProducts.error)
                );
            } else {
                const result = await addDataToFile(
                    path.join(__dirname, '..', '..', 'data', 'products.json'),
                    req,
                    res
                );
                if (result.success) {
                    res.status(200).json(
                        success('Successfully added data', result.data)
                    );
                } else {
                    res.status(400).json(failure('Can not add the data'));
                }
            }
        } catch (error) {
            res.status(500).json(failure('Internal server error'));
        }
    }
}

module.exports = Product;
