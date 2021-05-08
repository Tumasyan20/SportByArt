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
    last_login: {
        type: Date,
        default: Date.now()
    },
    root: {
        type: Number,
        default: 5
    }
});

module.exports = model("users", schema);