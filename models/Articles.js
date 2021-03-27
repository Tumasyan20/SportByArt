const {Schema, model} = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        requires: true
    },
    author: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    image: {
        type: String,
        require: true
    },
    shortDesc: {
        type: String,
        required: true
    },
    content: {
        type: String,
        require: true
    },
    publication: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        default: 0
    },
    category: {
        ref: 'categories',
        type: Schema.Types.ObjectId
    },
    subCategory: {
        ref: 'subcategories',
        type: Schema.Types.ObjectId
    }
});

module.exports = model('articles', schema);