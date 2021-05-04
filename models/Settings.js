const {Schema, model} = require('mongoose');

const schema = new Schema({
    about_us_title: {
        type: String,
        default: ''
    },
    about_us_content: {
        type: String,
        default: ''
    },
    email_username: {
        type: String,
        default: ''
    },
    email_password: {
        type: String,
        default: ''
    }
});

module.exports = model("settings", schema)