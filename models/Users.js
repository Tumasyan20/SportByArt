const {Schema, model} = require('mongoose');

const schema = new Schema({
    username : {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    root: {
        type: Number,
        default: 0
    }
});

module.exports = model("users", schema);