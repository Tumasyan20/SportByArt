const {Schema, model} = require('mongoose');

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    show_in_nav: {
        type: Boolean,
        default: "false"
    }
});

module.exports = model('categories', schema);