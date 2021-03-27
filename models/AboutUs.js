const {Schema, model} = require('mongoose');

const schema = new Schema({
    header: {
        type: String, 
        require: true
    },
    content: {
        type: String,
        require: true
    },
    thumb: {
        type: String,
        required: true
    }
});

module.exports = model('aboutus', schema);