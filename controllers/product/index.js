const path = require('path');
const { success, failure } = require('../../common/response');
const FileHandlerModel = require('../../model/filehandler');

class Product {
    async getAll(req, res) {
        try {
            const offset = parseInt(req.query.offset);
            const itemsPerPage = parseInt(req.query.itemsPerPage);
            const data = await FileHandlerModel.readFile(
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
            const result = await FileHandlerModel.readFile(
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
            const result = await FileHandlerModel.addDataToFile(
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
        } catch (error) {
            res.status(500).json(failure('Internal server error'));
        }
    }

    async deleteData(req, res) {
        try {
            const id = req.params.id;

            const result = await FileHandlerModel.deleteData(
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
            const id = req.params.id;
            const result = await FileHandlerModel.updateData(
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
        } catch (error) {
            res.status(500).json(failure('Internal server error'));
        }
    }

    async sortByPrice(req, res) {
        try {
            console.log('sort');
            const queryParams = req.query._sort;
            console.log();
            const result = await FileHandlerModel.readFile(
                path.join(__dirname, '..', '..', 'data', 'products.json')
            );

            if (queryParams == 'ASC') {
                const sortedData = result
                    .slice()
                    .sort((a, b) => a.price - b.price);
                res.status(200).json(
                    success('Successfully Get the data', sortedData)
                );
            } else if (queryParams == 'DESC') {
                const sortedData = result
                    .slice()
                    .sort((a, b) => b.price - a.price);
                res.status(200).json(
                    success('Successfully Get the data', sortedData)
                );
            }
        } catch (error) {
            return { success: false };
        }
    }
}

module.exports = Product;
