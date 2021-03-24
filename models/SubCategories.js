const {Schema, model} = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        ref: 'categories',
        type: Schema.Types.ObjectId
    }
});

module.exports = model('subcategories', schema);