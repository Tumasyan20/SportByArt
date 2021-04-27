const {Schema, model} = require('mongoose');

const schema = new Schema({
    image: {
        type: String,
        require: true
    },
    article: {
        ref: 'articles',
        type: Schema.Types.ObjectId
    }
});

module.exports = model('slider', schema);