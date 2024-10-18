const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true // Ensure this is true to enforce the validation
    },
    description: {
        type: String,
        required: false // Change to true if required
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
