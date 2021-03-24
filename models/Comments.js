const {Schema, model} = require('mongoose');

const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    publication: {
        type: Date,
        default: Date.now()
    },
    article: {
        ref: 'articles',
        type: Schema.Types.ObjectId
    }
});

module.exports = model("comments", schema)