const Article = require('../../models/Articles');
const fs = require('fs');
const fileType = require('file-type');

const test = (req, res) => {
    try {
        let result = {};
        let s = req.body.slider;
        console.log('request')
        for(i in s) {
            let imagePath = './debug/' + Date.now() + '.jpeg';

            const base64image = s[i].replace(/^data:([A-Za-z-+/]+);base64,/, '');
            
            fileType.fromBuffer(Buffer.from(base64image, 'base64'))
            .then((result) => {
                if(!result.mime.includes('image'))
                    console.error("ARTICLE: File is no image");
            });
            fs.writeFileSync(imagePath, base64image, {encoding: 'base64'});
            imagePath = imagePath.substring(1);
            result['key' + i] = imagePath;
        }
        return res.status(200).json(result) 
    } 
    catch(e) {
        console.error(e);
    }
}

module.exports = {test} 