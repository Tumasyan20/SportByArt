const Article = require('../../models/Articles');

const test = (req, res) => {
    Article.find({ publication: {$gte: new Date("2021-04"), $lte: new Date("2021-05") } }).then((result) => {
        res.status(200).json(result)
    });

    
}

module.exports = {test} 