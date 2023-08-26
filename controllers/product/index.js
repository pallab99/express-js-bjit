const path = require('path');
const { success, failure } = require('../../common/response');
const {
    readFile,
    addDataToFile,
    deleteData,
    updateData,
} = require('../../util/fileHandler');
const validateProductsBeforeAdd = require('../../util/addProductValidator');
const validateProductsBeforeUpdate = require('../../util/updateProductValidator');

class Product {
    async getAll(req, res) {
        try {
            const offset = parseInt(req.query.offset);
            const itemsPerPage = parseInt(req.query.itemsPerPage);
            const data = await readFile(
                path.join(__dirname, '..', '..', 'data', 'products.json')
            );
            if (isNaN(offset) && isNaN(itemsPerPage)) {
                res.status(200).json(
                    success('Successfully get the data', data)
                );
            } else {
                const startIndex = offset * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;

                const paginatedProducts = data.slice(startIndex, endIndex);
                res.status(200).json(
                    success('Successfully get the data', paginatedProducts)
                );
            }
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

    async deleteData(req, res) {
        try {
            const id = req.params.id;

            const result = await deleteData(
                path.join(__dirname, '..', '..', 'data', 'products.json'),
                req,
                res
            );
            if (result.success) {
                res.status(200).json(
                    success('Successfully deleted data', result.data)
                );
            } else {
                res.status(400).json(failure(`Id ${id} does not exist`));
            }
        } catch (error) {
            res.status(500).json(failure('Internal server error'));
        }
    }

    async updateData(req, res) {
        try {
            const validateProducts = validateProductsBeforeUpdate(req);
            if (!validateProducts.success) {
                res.status(400).json(
                    failure('Can not add products', validateProducts.error)
                );
            } else {
                const id = req.params.id;
                const result = await updateData(
                    path.join(__dirname, '..', '..', 'data', 'products.json'),
                    req,
                    res
                );
                if (result.success) {
                    res.status(200).json(
                        success('Successfully updated the data', result.data)
                    );
                } else {
                    res.status(400).json(failure(`Id ${id} does not exist`));
                }
            }
        } catch (error) {
            res.status(500).json(failure('Internal server error'));
        }
    }
}

module.exports = Product;
