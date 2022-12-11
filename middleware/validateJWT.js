const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next)=>{

    const token = req.header('Token');
    
    if(!token){
        return res.status(400).send("Missing access token");
    }
    try {
        const { iduser, idamdin ,rol, name,...object } = jwt.verify(token, process.env.JWT);
        req.body.iduser = Number (iduser);
        req.iduser = Number (iduser);
        req.body.rol = rol;
        req.body.name = name;
        next();
    } catch (err) {
        return res.status(400).send("Invalid access token");
    }
}
module.exports = { validateJWT }