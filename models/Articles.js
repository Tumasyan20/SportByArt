const {Schema, model} = require('mongoose');


const schema = new Schema({
    title: {
        type: String,
        requires: true
    },
    author_id: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    author_username: {
        type: String,
        require: true
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
        default: Date.now(),
    },
    rating: {
        type: Number,
        default: 0
    },
    category_name: {
        type: String,
        required: true
    },
    category_id: {
        ref: 'categories',
        type: Schema.Types.ObjectId
    },
    subCategory_name: {
        type: String,
        require: true
    },
    subCategory_id: {
        ref: 'subcategories',
        type: Schema.Types.ObjectId
    }
});

module.exports = model('articles', schema);