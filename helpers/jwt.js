const jwt = require('jsonwebtoken');

const generateJWT = (iduser, name , rol) =>{

    return new Promise((resolve,reject) => {
        const payload = {iduser, rol, name};
        jwt.sign(payload, process.env.JWT,{
            expiresIn:'350d'
        },
        (err, token) =>{
            if(err){
                console.log(err);
                reject('Token not generated');
            }else{
                resolve(token);
            }
        });

    });

}

module.exports = {generateJWT: generateJWT};