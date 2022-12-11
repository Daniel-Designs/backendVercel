const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const validator = require('validator');

async function main(){

    exports.getAdmins = async (req, res) => {
        
        const { rol } = req.body

        if (rol!='ADMIN') {
            return res.status(401).send(`You must be an Administrator`);
        }

        const skip = req.body.skip || 0;
        const take = req.body.take || 10;

        const allAdmins = await prisma.admins.findMany({
            skip,
            take,
            select: {
                idadmin: true,
                username: true,
                email: true
            },
        });
        res.status(200).json(allAdmins);
    };

    exports.getAdminById = async (req, res) => {
        const { id } = req.params
        const {rol} = req.body
        
        if (rol!='ADMIN') {
            return res.status(401).send(`You must be an Administrator`);
        }

        const oneAdmin = await prisma.admins.findUnique({
            where: { idadmin: Number(id) },
            select: {
                idadmin: true,
                username: true,
                email: true
            },
        });
        res.status(200).json(oneAdmin);
    };

    exports.createAdmin = async (req, res) => {
        const { password, username, email, rol } = req.body;
       
        if (rol!='ADMIN') {
            return res.status(401).send(`You must be an Administrator`);
        }

        if (!(email && password && username)) {
            return res.status(400).send("Missing required fields");
        }

        if (!validator.isEmail(email)){
            return res.status(400).send("Invalid email");
        }

        if (!validator.isAlphanumeric(username, 'en-US', {ignore: '_-.'}) || !validator.isLength(username, 4, 20)){
            return res.status(400).send("Invalid username");
        }

        if (!validator.isLength(password, 8, 30)){
            return res.status(400).send("Password should be at least 8 characters");
        }

        const existingEmail = await prisma.admins.findUnique({where: { email: email }});
        const existingUsername = await prisma.admins.findUnique({where: { username: username }});

        if (existingEmail || existingUsername) {
            return res.status(400).send('Admin already exists');
        }

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password,salt);

        const admin = await prisma.admins.create({
            data: {
                password:hashedPassword,
                username,
                email: validator.normalizeEmail(email),
            }
        });
        res.status(201).send(`Admin ${admin.username} registered successfully`);
    };

    exports.updateAdmin = async (req, res) => {
        const { id } = req.params
        const { password, username, email, rol } = req.body;

         
        if (rol!='ADMIN') {
            return res.status(401).send(`You must be an Administrator`);
        }

        const oldAdmin = await prisma.admins.findUnique({where: {idadmin: Number(id)}})

        if (!oldAdmin) {
            return res.status(400).send(`User doesn't exist`);
        }

        if (email){
            const existingEmail = await prisma.admins.findUnique({where: { email: email }});
            if (existingEmail || !validator.isEmail(email)){
                return res.status(400).send("Invalid email");
            }
            const updatedAdmin = await prisma.admins.update({
                where: { idadmin: Number(id) },
                data: {
                    email: validator.normalizeEmail(email),
                }
            });
            return res.status(200).send(`User ${updatedAdmin.username} email updated successfully`);
        }

        if (username){
            const existingUsername = await prisma.admins.findUnique({where: { username: username }});
            if (existingUsername || !validator.isAlphanumeric(username, 'en-US', {ignore: '_-.'}) || !validator.isLength(username, 4, 20)){
                return res.status(400).send("Invalid username");
            }
            const updatedAdmin = await prisma.admins.update({
                where: { idadmin: Number(id) },
                data: {
                    username: username,
                }
            });
            res.status(200).send(`User ${updatedAdmin.username} username updated successfully`);
        }

        if (password) {
            if (!validator.isLength(password, 4, 20)) {
                return res.status(400).send("Password length must be at least 8 characters");
            }
            const salt = bcrypt.genSaltSync();
            const hashedPassword = bcrypt.hashSync(password,salt);
            const updatedAdmin = await prisma.admins.update({
                where: { idadmin: Number(id) },
                data: {
                    password: hashedPassword,
                }
            });
            return res.status(200).send(`User ${updatedAdmin.username} password updated successfully`);
        }
    };

    exports.deleteAdmin = async (req, res) => {
        const { id } = req.params
        const { rol } = req.body

        if (rol!='ADMIN') {
            return res.status(401).send(`You must be an Administrator`);
        }

        const existingAdmin = await prisma.admins.findUnique({where: { idadmin: Number(id) }});

        if (!existingAdmin) {
            return res.status(400).send(`Admin doesn't exist`);
        }

        await prisma.admins.delete({
            where: { idadmin: Number(id) }
        });
        res.status(200).send(`Admin with id: ${id} deleted successfully`);
    };
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
