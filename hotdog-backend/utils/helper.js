const crypto = require("crypto")

exports.sendError = (res, message) => {
    return res.status(400).json({ error: message });
};

exports.createRandomBytes = () => 
    new  Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
        if(err) reject(err);

        const token = buff.toString('hex');
        resolve(token)
    });

    
});
