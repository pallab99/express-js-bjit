const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    category: String,
    thumbnail: String,
    images: [String],
});

exports.products = mongoose.model('products', productSchema);
