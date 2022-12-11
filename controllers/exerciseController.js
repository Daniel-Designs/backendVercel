// noinspection DuplicatedCode,JSUnresolvedVariable,JSUnresolvedFunction

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validator = require("validator");


const getExerciseLevelLabel = (levelNumber) => {
    if (levelNumber < 35 ) return 'Basic';
    if (levelNumber < 65 ) return 'Intermediate';
    return 'Advanced';
}

async function main() {
    /* C R U D EXERCISES TABLE */

    exports.getExercises = async (req, res) => {
        const skip = Number(req.query.skip) || 0;
        const take = Number(req.query.take) || 10;
        const exercisesCount = await prisma.exercise.count();

        console.log(`GET All Exercises, skip ${skip}, take ${take}, total ${exercisesCount}`)
        const allExercises = await prisma.exercise.findMany({
            skip,
            take,
            select: {
                idexercise: true,
                title: true,
                exerskill: true,
                exerlevel: true,
                exertype: true,
                exertopic: true,
                exbody: true,
                exstate: true,
            },
        });
        res.json({
            exercises: allExercises,
            total: exercisesCount
        });
    };

    exports.getExercisesByLevel = async (req, res) => {
        const level = Number(req.params.level);
        const skip = Number(req.query.skip) || 0;
        const take = Number(req.query.take) || 10;
        const exercisesCount = await prisma.exercise.count({
            where: {
                exerlevel: {
                    is: {
                        level: getExerciseLevelLabel(level)
                    }
                }
            }
        });

        console.log(`GET Exercises by Level: ${level}, skip ${skip}, take ${take}, total ${exercisesCount}`)
        const allExercises = await prisma.exercise.findMany({
            skip,
            take,
            where: {
                exerlevel: {
                    is: {
                        level: getExerciseLevelLabel(level)
                    }
                },
            },
            select: {
                idexercise: true,
                title: true,
                exerskill: true,
                exerlevel: true,
                exertype: true,
                exertopic: true,
                exbody: true,
                exstate: true,
            },
        });
        res.json({
            exercises: allExercises,
            total: exercisesCount
        });
    };

    exports.getExerciseById = async (req, res) => {
        const { id } = req.params;
        const oneExercise = await prisma.exercise.findUnique({
            where: { idexercise: Number(id) },
            select: {
                idexercise: true,
                title: true,
                exerskill: true,
                exerlevel: true,
                exertype: true,
                exertopic: true,
                exbody: true,
                exstate: true,
            },
        });
        res.json(oneExercise);
    };

    exports.createExercise = async (req, res) => {
        var {typeID, topic, exbody, title, skillID, levelID, rol } =
            req.body;
            const adminID = req.iduser;
            //console.log(req.file)
            //console.log(req.body.exbody)
       
        exbody = JSON.parse(exbody)

        if (!(adminID && typeID && exbody && title && skillID && levelID)) {
            console.log(typeID,exbody,levelID,title,skillID, adminID)
            return res.status(400).send("Missing required fields");
        }

        if (!validator.isLength(title, 1, 100)) {
            return res.status(400).send("Invalid title");
        }

        const admin = await prisma.admins.findUnique({
            where: { idadmin: adminID },
        });

        if (!admin) {
            return res.status(400).send("Invalid creator of exercise");
        }
        const typeCorrect = await prisma.exercisetype.findFirst({
            where: { idtype: typeID },
        });

        if (!typeCorrect) {
            return res.status(400).send("Invalid type of exercise");
        }

        const skillCorrect = await prisma.exerciseskill.findFirst({
            where: { idskill: skillID },
        });

        if (!skillCorrect) {
            return res.status(400).send("Invalid skill of exercise");
        }

        const levelCorrect = await prisma.exerciselevel.findFirst({
            where: { idlevel: levelID },
        });

        if (!levelCorrect) {
            return res.status(400).send("Invalid level of exercise");
        }

        const topicExists = await prisma.exercisetopic.findFirst({
            where: { desctopic: topic },
        });
        if(req.file){
        exbody.S = req.file.originalname;
        }
        
        if (topic) {
            let finalTopic = topicExists;
            if (!topicExists) {
                //return res.status(400).send("Invalid topic of exercise");
                // TODO: create new topic
                finalTopic = await prisma.exercisetopic.create({
                    data: { desctopic: topic },
                });
            }
            const exercise = await prisma.exercise.create({
                data: {
                    title,
                    skillID,
                    typeID,
                    levelID,
                    topicID: finalTopic.idtopic,
                    exbody,
                    createdby: {
                        connect: { idadmin: adminID },
                    },
                },
            });
            res.status(201).send(
                `Exercise ${exercise.idexercise} registered successfully`
            );
        } else {
            const exercise = await prisma.exercise.create({
                data: {
                    title,
                    skillID,
                    typeID,
                    levelID,
                    exbody,
                    createdby: {
                        connect: { idadmin: adminID },
                    },
                },
            });
            
            res.status(201).send(
                `Exercise ${exercise.idexercise} registered successfully`
            );
        }
    };

    exports.updateExercise = async (req, res) => {
        const { id } = req.params;
        const {
            createdby,
            title,
            skillID,
            typeID,
            levelID,
            topic,
            exbody,
            exstate,
            rol
        } = req.body;
        
        if (rol!='ADMIN') {
            return res.status(401).send(`You must be an Administrator`);
        }
        
        const oldExercise = await prisma.exercise.findUnique({
            where: { idexercise: Number(id) },
        });

        if (!oldExercise) {
            return res.status(400).send(`Exercise doesn't exist`);
        }

        const admin = await prisma.admins.findMany({
            where: { idadmin: createdby },
        });

        if (!admin) {
            return res.status(400).send("Invalid admin for modifying exercise");
        }

        if (title && !validator.isLength(title, 1, 100)) {
            return res.status(400).send("Invalid title");
        }

        const typeCorrect = await prisma.exercisetype.findFirst({
            where: { idtype: typeID },
        });

        if (typeID && !typeCorrect) {
            return res.status(400).send("Invalid type of exercise");
        }

        const skillCorrect = await prisma.exerciseskill.findFirst({
            where: { idskill: skillID },
        });

        if (skillID && !skillCorrect) {
            return res.status(400).send("Invalid type of exercise");
        }

        const levelCorrect = await prisma.exerciselevel.findFirst({
            where: { idlevel: levelID },
        });

        if (levelID && !levelCorrect) {
            return res.status(400).send("Invalid type of exercise");
        }

        if (exstate && (exstate !== "active" || exstate !== "inactive")) {
            return res.status(400).send("Invalid state of exercise");
        }

        const updatedExercise = await prisma.exercise.update({
            where: { idexercise: Number(id) },
            data: {
                createdby,
                typeID,
                levelID,
                skillID,
                exertopic: {
                    connectOrCreate: {
                        where: { desctopic: topic },
                        create: { desctopic: topic },
                    },
                },
                exbody,
                title,
                exstate,
            },
        });
        res.status(200).send(
            `Exercise ${updatedExercise.idexercise} updated successfully`
        );
    };

    exports.deleteExercise = async (req, res) => {
        const { id } = req.params;
        const { rol } = req.body;
        if (rol!='ADMIN') {
            return res.status(401).send(`You must be an Administrator`);
        }
        
        const existingExercise = await prisma.exercise.findUnique({
            where: { idexercise: Number(id) },
        });

        if (!existingExercise) {
            return res.status(400).send(`Exercise doesn't exist`);
        }

        await prisma.exercise.delete({
            where: { idexercise: Number(id) },
        });
        res.status(200).send(`Exercise with id: ${id} deleted successfully`);
    };

    /*  C R U D EXERCISES TOPIC TABLE  */

    exports.info = async( req, res) => {
        const types = await prisma.exercisetype.findMany();
        const skills = await prisma.exerciseskill.findMany();
        const levels = await prisma.exerciselevel.findMany();
        const topics = await prisma.exercisetopic.findMany({select:{desctopic:true}});

        const info = {
            types,
            skills,
            levels,
            topics
        }
        return res.status(200).send(info)
    }

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
