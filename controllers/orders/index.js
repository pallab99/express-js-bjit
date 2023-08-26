const path = require('path');
const { readFile, addDataToFile } = require('../../util/fileHandler');
const { failure, success } = require('../../common/response');

class Orders {
    async getAllOrders(req, res) {
        try {
            const ordersData = await readFile(
                path.join(__dirname, '..', '..', 'data', 'orders.json'),
                'utf-8'
            );
            res.status(200).json(
                success('Successfully get the data', ordersData)
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getOrderByUserId(req, res) {
        try {
            const id = req.params.user_id;
            const orders = await readFile(
                path.join(__dirname, '..', '..', 'data', 'orders.json')
            );
            const filteredData = orders.filter((ele) => {
                return ele.user.id === +id;
            });

            if (filteredData.length) {
                const productsId = filteredData[0].products;
                const productData = await readFile(
                    path.join(__dirname, '..', '..', 'data', 'products.json')
                );

                const newData = productData.filter((product) => {
                    return productsId.includes(product.id);
                });
                const responseData = {
                    id: id,
                    user: filteredData[0].user,
                    product: newData,
                };
                res.status(200).json(
                    success('Successfully get the data', responseData)
                );
            } else {
                res.status(400).json(failure(`User id ${id} does not exist`));
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(failure('Internal Server Error'));
        }
    }

    async createOrders(req, res) {
        try {
            const body = req.body;
            const user_area = body.user.address.area;
            const orderedProducts = body.products;

            const coverage_area = await readFile(
                path.join(__dirname, '..', '..', 'data', 'coverage.json')
            );
            const products = await readFile(
                path.join(__dirname, '..', '..', 'data', 'products.json')
            );

            const productIds = products.map((product) => product.id);
            const isAllProductsAvailable = orderedProducts.every(
                (orderedProduct) => {
                    return productIds.includes(orderedProduct);
                }
            );

            const isAreaAvailable = coverage_area[0].coverage_area.findIndex(
                (ele) => ele === user_area
            );
            if (
                isAreaAvailable != -1 &&
                isAllProductsAvailable &&
                orderedProducts.length
            ) {
                const result = await addDataToFile(
                    path.join(__dirname, '..', '..', 'data', 'orders.json'),
                    req,
                    res
                );
                if (result.success) {
                    res.status(200).json(
                        success('Order Placed Successfully', result.data)
                    );
                } else {
                    res.status(400).json(failure('Can not placed the order'));
                }
            } else {
                const error = {};
                if (isAreaAvailable === -1) {
                    error.area = 'The Area is not available';
                }
                if (!isAllProductsAvailable) {
                    error.product = 'Your selected product is not available';
                } else if (!orderedProducts.length) {
                    error.product = 'You did not selected any products';
                }

                if (Object.keys(error).length) {
                    res.status(400).json(
                        failure('Can not place your order', error)
                    );
                }
            }
        } catch (error) {
            res.status(500).json(failure('Internal Server Error'));
        }
    }
}
module.exports = new Orders();
