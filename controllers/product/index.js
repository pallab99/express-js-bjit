const path = require('path');
const { success, failure } = require('../../common/response');
const FileHandlerModel = require('../../model/filehandler');
const { validationResult } = require('express-validator');
const ProductModel = require('../../model/products');
const databaseErrorHandler = require('../../util/dbError');

class ProductController {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.offset);
            const limit = parseInt(req.query.limit);
            if (isNaN(page) && isNaN(limit)) {
                const data = await ProductModel.find().limit(30);
                if (data.length) {
                    res.status(200).json(
                        success('Successfully get the data', {
                            items: data,
                            totalCount: data.length,
                        })
                    );
                } else {
                    res.status(400).json(success('Can not get the data', []));
                }
            } else {
                const skip = (page - 1) * limit;
                const data = await ProductModel.find({})
                    .skip(skip)
                    .limit(limit);
                const totalCount = await ProductModel.countDocuments();
                const totalPages = Math.ceil(totalCount / limit);

                if (data.length) {
                    res.status(200).json(
                        success('Successfully get the data', {
                            items: data,
                            currentPage: page,
                            totalPages: totalPages,
                        })
                    );
                } else {
                    res.status(400).json(success('Can not get the data', []));
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal server error'));
        }
    }

    async getDataById(req, res) {
        try {
            const { id } = req.params;
            const data = await ProductModel.findById(id);
            if (data) {
                res.status(200).json(
                    success('Successfully get the data', data)
                );
            } else {
                res.status(400).json(failure(`Id ${id} does not exist`));
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async addData(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length) {
                const error = {};
                validation.forEach((ele) => {
                    const property = ele.path;
                    error[property] = ele.msg;
                });
                res.status(422).json(failure('Unprocessable Entity', error));
            } else {
                const dataToInsert = req.body;
                const result = await ProductModel.insertMany(dataToInsert);
                if (result.length) {
                    res.status(200).json(
                        success('Successfully added data', result)
                    );
                } else {
                    res.status(400).json(failure('Can not add the data'));
                }
            }
        } catch (error) {
            databaseErrorHandler(error.message);
            res.status(500).json(failure('Internal server error'));
        }
    }

    async deleteData(req, res) {
        try {
            const { id } = req.params;
            const data = await ProductModel.findById(id);
            if (data) {
                const result = await ProductModel.findByIdAndDelete(id);
                res.status(200).json(success('Successfully deleted', result));
            } else {
                res.status(400).json(failure(`Id ${id} does not exist`));
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal server error'));
        }
    }

    async updateData(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductModel.findById(id);
            const updateData = req.body;
            if (result) {
                const updateResult = await ProductModel.findByIdAndUpdate(
                    { _id: id },
                    { $set: updateData },
                    { new: true }
                );
                res.status(400).json(
                    success(`Updated Successfully`, updateResult)
                );
            } else {
                res.status(400).json(failure(`Id ${id} does not exist`));
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal server error'));
        }
    }

    async sortByPrice(req, res) {
        try {
            const queryParams = req.query._sort;
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
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async filterByCategory(req, res) {
        try {
            const { category } = req.query;

            const result = await FileHandlerModel.readFile(
                path.join(__dirname, '..', '..', 'data', 'products.json')
            );
            let categoryArray = [];
            if (typeof category === 'string') {
                categoryArray.push(category);
            } else {
                category.forEach((ele) => {
                    categoryArray.push(ele);
                });
            }

            const filteredData = result.filter((item) =>
                categoryArray.includes(item.category)
            );
            if (filteredData.length) {
                res.status(200).json(
                    success('Successfully Get the data', filteredData)
                );
            } else {
                res.status(200).json(
                    success('There is data with this categories', filteredData)
                );
            }
        } catch (error) {
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async filterByBrand(req, res) {
        try {
            const { brand } = req.query;

            const result = await FileHandlerModel.readFile(
                path.join(__dirname, '..', '..', 'data', 'products.json')
            );
            let brandArray = [];
            if (typeof brand === 'string') {
                brandArray.push(brand);
            } else {
                brand.forEach((ele) => {
                    brandArray.push(ele);
                });
            }

            const filteredData = result.filter((item) =>
                brandArray.includes(item.brand)
            );
            if (filteredData.length) {
                res.status(200).json(
                    success('Successfully Get the data', filteredData)
                );
            } else {
                res.status(200).json(
                    success(
                        'There is no data with this categories',
                        filteredData
                    )
                );
            }
        } catch (error) {
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async filterProducts(req, res) {
        try {
            const validateResult = validationResult(req).array();
            const { category, brand, ram, processor, os, storage } = req.query;
            if (validateResult.length != 0) {
                res.status(400).json(
                    failure('Unprocessable input.', validateResult)
                );
            } else {
                const result = await ProductModel.find({
                    ram: { $exists: true },
                    processor: { $exists: true },
                    storage: { $exists: true },
                    os: { $exists: true },
                });

                if (result.length === 0) {
                    return res
                        .status(400)
                        .json(
                            success(
                                'There is no data with these categories',
                                []
                            )
                        );
                }

                let filteredData = [];

                const allDefined = [
                    category,
                    brand,
                    ram,
                    processor,
                    os,
                    storage,
                ].every((prop) => prop !== undefined);

                const categories = category?.split(',');
                const brands = brand?.split(',');
                // console.log('Hello', categories);
                if (allDefined) {
                    filteredData = result.filter(
                        (item) =>
                            categories.includes(item.category) &&
                            brands.includes(item.category) &&
                            item.ram == ram &&
                            item.processor == processor &&
                            item.os == os &&
                            item.storage == storage
                    );
                } else if (
                    category &&
                    brand &&
                    !ram &&
                    !processor &&
                    !os &&
                    !storage
                ) {
                    filteredData = result.filter(
                        (item) =>
                            categories.includes(item.category) &&
                            brands.includes(item.brand)
                    );
                } else if (
                    category &&
                    !brand &&
                    !ram &&
                    !processor &&
                    !os &&
                    !storage
                ) {
                    filteredData = result.filter((item) =>
                        categories.includes(item.category)
                    );
                } else if (
                    brand &&
                    !category &&
                    !ram &&
                    !processor &&
                    !os &&
                    !storage
                ) {
                    filteredData = result.filter((item) =>
                        brands.includes(item.brand)
                    );
                } else if (category && brand) {
                    filteredData = result.filter(
                        (item) =>
                            categories.includes(item.category) &&
                            brands.includes(item.brand) &&
                            (item.ram === ram ||
                                item.processor === processor ||
                                item.os === os ||
                                item.storage === storage)
                    );
                } else if (category) {
                    filteredData = result.filter(
                        (item) =>
                            categories.includes(item.category) &&
                            (item.ram === ram ||
                                item.processor === processor ||
                                item.os === os ||
                                item.storage === storage)
                    );
                } else if (brand) {
                    filteredData = result.filter(
                        (item) =>
                            brands.includes(item.brand) &&
                            (item.ram === ram ||
                                item.processor === processor ||
                                item.os === os ||
                                item.storage === storage)
                    );
                } else {
                    filteredData = result.filter(
                        (item) =>
                            categories.includes(item.category) ||
                            brands.includes(item.brand) ||
                            item.ram === ram ||
                            item.processor === processor ||
                            item.os === os ||
                            item.storage === storage
                    );
                }

                if (filteredData.length !== 0) {
                    res.status(200).json(
                        success('Successfully get the data', filteredData)
                    );
                } else {
                    res.status(200).json(
                        success('No data found', filteredData)
                    );
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async searchProducts(req, res) {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(422).json(failure('Query can not be empty'));
            }
            const result = await ProductModel.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { brand: { $regex: query, $options: 'i' } },
                ],
            });
            if (result.length) {
                res.status(200).json(
                    success('Successfully get the data', result)
                );
            } else {
                res.status(200).json(success('Can not get the data', []));
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}

module.exports = ProductController;
