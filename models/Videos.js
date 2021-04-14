const {Schema, model} = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        requierd: true
    },
    video: {
        type: String,
        required: true
    },
    publication: {
        type: Date,
        default: Date.now()
    },
    category_id: {
        ref: 'categories',
        type: Schema.Types.ObjectId
    },
    category_name: {
        type: String,
        require: true
    },
    author_id: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    author_username: {
        type: String,
        require: true
    }
});

module.exports = model("videos", schema);