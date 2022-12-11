// noinspection JSUnresolvedFunction,JSUnresolvedVariable

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validator = require("validator");
const { stat } = require("fs");
const { count } = require("console");

function range (start, end) {
    return new Array(end - start).fill().map((d, i) => i + start);
}
  
async function main() {
    exports.getUsers = async (req, res) => {
        const skip = req.body.skip || 0;
        const take = req.body.take || 10;
        const userCount = await prisma.user.count();

        const allUsers = await prisma.user.findMany({
            skip,
            take,
            select: {
                iduser: true,
                name: true,
                username: true,
                email: true,
                emailr: true,
                age: true,
                level: true,
                speakinglevel: true,
                writinglevel: true,
                grammarlevel: true,
                bio: true,
                state_user: true,
            },
        });
        allUsers.map((user)=>{
            const {state_user, ...obj} = user;
            user.state = state_user.statedesc;
            delete user.state_user;
        })
        
        res.status(200).send({
            users: allUsers,
            total: userCount
        });
    };
    
    exports.getUsersByLevel = async (req, res) => {
        const level  = Number(req.params.level);
        const skip = Number(req.query.skip) || 0;
        const take = Number(req.query.take) || 10;
        const user = Number(req.query.user) || null;
        const userCount = await prisma.user.count();
        
        console.log(`GET User by level ${level}, skip ${skip}, take ${take}, not ${user}`);
        
        const allUsersByLevel = await prisma.user.findMany({
            skip,
            take,
            where: {
                level: {in: range(level-17,level+17)},
                NOT: {
                    iduser: user
                }
            },
            select: {
                iduser: true,
                name: true,
                username: true,
                email: true,
                emailr: true,
                age: true,
                level: true,
                speakinglevel: true,
                writinglevel: true,
                grammarlevel: true,
                bio: true,
                state_user: true,
            },
        });
        allUsersByLevel.map((user)=>{
            const {state_user, ...obj} = user;
            user.state = state_user.statedesc;
            delete user.state_user;
        })
        
        res.status(200).send({
            users: allUsersByLevel,
            total: userCount
        });
    };

    exports.getUserById = async (req, res) => {
        const { id } = req.params;
        
        const oneUser = await prisma.user.findUnique({
            where: { iduser: Number(id) },
            select: {
                iduser: true,
                name: true,
                username: true,
                email: true,
                emailr: true,
                age: true,
                level: true,
                speakinglevel: true,
                writinglevel: true,
                grammarlevel: true,
                bio: true,
                state_user: true,
            },
        });
        const {state_user, ...obj} = oneUser;
        const state = state_user.statedesc;
        obj.state = state; 
        res.status(200).send(obj);
    };

    exports.createUser = async (req, res) => {
        const { name, password, username, email, age } = req.body;

        if (!(name && email && password && username && age)) {
            return res.status(400).send("Missing required fields");
        }

        if (age < 18) {
            return res
                .status(400)
                .send("You must be at least 18 to use this app");
        }

        if (!validator.isEmail(email)) {
            return res.status(400).send("Invalid email");
        }

        if (
            !validator.isAlphanumeric(username, "en-US", { ignore: "_-." }) ||
            !validator.isLength(username, 4, 20)
        ) {
            return res.status(400).send("Invalid username");
        }

        if (
            !validator.isAlpha(name, "en-US", { ignore: " -" }) ||
            !validator.isLength(name, 3)
        ) {
            return res.status(400).send("Invalid name");
        }

        if (!validator.isLength(password, 8, 30)) {
            return res
                .status(400)
                .send("Password should be at least 8 characters");
        }
        const existingEmail = await prisma.user.findUnique({
            where: { email: email },
        });
        const existingUsername = await prisma.user.findUnique({
            where: { username: username },
        });

        if (existingEmail || existingUsername) {
            return res.status(400).send("User already exists");
        }

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                password: hashedPassword,
                username,
                email: validator.normalizeEmail(email),
                age,
            },
        });
        res.status(201).send(`User ${user.username} registered successfully`);
    };

    exports.updateUser = async (req, res) => {
        const { id } = req.params;
        let { name, username, email, age, bio, password, state } = req.body;

        const oldUser = await prisma.user.findUnique({
            where: { iduser: Number(id) },
            select: { username: true, email: true },
        });

        if (!oldUser) {
            return res.status(400).send(`User doesn't exist`);
        }

        if (age && age < 18) {
            return res
                .status(400)
                .send("You must be at least 18 to use this app");
        }

        if (email && email !== oldUser.email) {
            const existingEmail = await prisma.user.findUnique({
                where: { email: email },
            });
            if (existingEmail || !validator.isEmail(email)) {
                return res.status(400).send("Invalid email");
            }
            email = validator.normalizeEmail(email);
        }

        if (username && username !== oldUser.username) {
            const existingUsername = await prisma.user.findUnique({
                where: { username: username },
            });
            if (
                existingUsername ||
                !validator.isAlphanumeric(username, "en-US", {
                    ignore: "_-.",
                }) ||
                !validator.isLength(username, 4, 20)
            ) {
                return res.status(400).send("Invalid username");
            }
        }

        // if (password) {
        //     if (!validator.isLength(password, 4, 20)) {
        //         return res
        //             .status(400)
        //             .send("Password length must be at least 8 characters");
        //     }
        //     const salt = bcrypt.genSaltSync();
        //     password = bcrypt.hashSync(password, salt);
        // }

        if (
            name &&
            (!validator.isAlpha(name, "en-US", { ignore: " -" }) ||
                !validator.isLength(name, 3))
        ) {
            return res.status(400).send("Invalid name");
        }

        if (bio) {
            if (!validator.isLength(bio, 1, 660)) {
                return res.status(400).send("Keep bio below 660 characters");
            }
            bio = validator.escape(bio);
        }

        const newUser = await prisma.user.update({
            where: { iduser: Number(id) },
            data: {
                name: name ?? oldUser.name,
                age: age ?? oldUser.age,
                username:  username ?? oldUser.username,
                // password,
                email: email ?? oldUser.email,
                bio: bio ?? oldUser.email,
                state: state ?? oldUser.state
            },
            select: {
                iduser: true,
                name: true,
                username: true,
                email: true,
                emailr: true,
                age: true,
                level: true,
                speakinglevel: true,
                writinglevel: true,
                grammarlevel: true,
                bio: true,
                state_user: true,
            },
        });
        
        res.status(200).send(newUser);
    };

    exports.deleteUser = async (req, res) => {
        const { id, rol } = req.params;
        
        if (rol!='ADMIN') {
            return res.status(401).send(`You must be an Administrator`);
        }
        const existingUser = await prisma.user.findUnique({
            where: { iduser: Number(id) },
        });

        if (!existingUser) {
            return res.status(400).send(`User doesn't exist`);
        }

        await prisma.user.delete({
            where: { iduser: Number(id) },
        });
        res.status(200).send(`User with id: ${id} deleted successfully`);
    };

    /* RELATED TO USERS   */

    exports.addFriend = async (req, res) => {
        const { id } = req.params;
        const { idFriend } = req.body;

        if (Number(id) === idFriend) {
            return res.status(400).send("The IDs must be different");
        }

        const [existId, existIdFriend, alreadyExist] = await Promise.all([
            prisma.user.findUnique({ where: { iduser: Number(id) } }),
            prisma.user.findUnique({ where: { iduser: idFriend } }),
            prisma.favorites.findFirst({
                where: {
                    sourceuser: Number(id),
                    favuser: idFriend,
                },
            }),
        ]);

        if (!existId || !existIdFriend) {
            return res.status(400).send("There is some invalid ID");
        }

        if (alreadyExist) {
            return res.status(400).send("Already exist");
        }

        const result = await prisma.favorites.create({
            data: {
                sourceuser: Number(id),
                favuser: idFriend,
            },
         });

        res.status(200).send(result);
    };
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
