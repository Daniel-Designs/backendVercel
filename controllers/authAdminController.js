// const {response} = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {generateJWT} = require('../helpers/jwt')
const { PrismaClient } = require('@prisma/client')
const validator = require("validator");
const e = require('express');
const prisma = new PrismaClient();

const login = async (req, res) => {
    const {email,password} = req.body;

    if (!(email && password)) {
        return res.status(400).send("Missing required fields");
    }

    if (!validator.isEmail(email)) {
        return res.status(400).send("Invalid email address");
    }

    try {
        const userDB = await prisma.admins.findFirst({where: {email:email}});
        if(!userDB){
            return res.status(400).send('Invalid login credentials');
        }
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if(!validPassword){
            return res.status(400).send('Invalid login credentials');
        }
 
        const token = await generateJWT(userDB.idadmin, userDB.username,'ADMIN');

        return res.status(200).json({
            msg: 'Log in successful',
            iduser:userDB.idadmin,
            name:userDB.username,
            username: userDB.username,
            email: userDB.email,
            rol:'ADMIN',
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send('Log in error');
    }
    
}

const token = async (req, res)=>{
    try {
        const token = req.headers['x-token'];
        const { iduser } = jwt.verify(token, process.env.JWT);

        const userDB = await prisma.admins.findUnique({where: {idadmin: Number(iduser)}});

        if (!userDB) {
            return res.status(400).json('Invalid token 1');
        }
        const newToken = await generateJWT(iduser,'ADMIN');
        return res.status(200).json({
            msg: 'Validated token',
            iduser:iduser,
            rol:'ADMIN',
            token: newToken
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json('Invalid token 2');
    }
   
}

module.exports = {login,token}
