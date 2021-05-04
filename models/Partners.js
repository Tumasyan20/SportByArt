const {Schema, model} = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    url: {
        type: String,
        require: true
    }
});

module.exports = model("partners", schema)