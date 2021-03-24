const {Schema, model} = require('mongoose');

const schema = new Schema({
    email: {
        type: String,
        require: true
    }
});

module.export = model('subscribe', schema);