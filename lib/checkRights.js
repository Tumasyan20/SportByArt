const User = require('../models/Users');


const checkRights = async(id, root) => {
    await User.findById({"_id" : id}).catch(error => {
        return false;
    })
    .then((result) => {
        if(result.length == 0) {
            return false;
        }

        if(result.root != root) {
            return false;
        }
        return true;
    });
};

module.exports = checkRights;