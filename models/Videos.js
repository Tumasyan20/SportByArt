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
    category: {
        ref: 'categories',
        type: Schema.Types.ObjectId
    }
});

module.exports = model("videos", schema)