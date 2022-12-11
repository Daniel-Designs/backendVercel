const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validator = require("validator");
const { updateScores } = require('../scoring/scoring');

async function main() {
    /* C R U D EXERCISES TABLE */

    exports.getExerciseResults = async (req, res) => {
        const skip = req.body.skip || 0;
        const take = req.body.take || 10;
        const allExercisesResuls = await prisma.userexercises.findMany({
            skip,
            take
        });
        res.json(allExercisesResuls);
    };

    exports.getExerciseResultById = async (req, res) => {
        var { iduser, idexercise } = req.params;
        iduser = Number(iduser);
        idexercise = Number(idexercise);
        const oneExerciseResult = await prisma.userexercises.findUnique({
            where:{
                idexercise_iduser: {
                    iduser: iduser,
                    idexercise: idexercise,
                  },
            },
        });
        res.json(oneExerciseResult);
    };

    exports.createExerciseResult = async (req, res) => {
        const { rol, iduser, idexercise, results} = req.body;
        
        if (!(iduser && idexercise && results)) {
            return res.status(400).send("Missing required fields");
        }

        const existUser = await prisma.user.findUnique({
            where: { iduser },
            select: {
                iduser: true,
                speakinglevel: true,
                writinglevel: true,
                grammarlevel: true
            }
        });

        if (!existUser) {
            return res.status(400).send(`User doesn't exist`);
        }

        const existExercise = await prisma.exercise.findUnique({
            where: { idexercise },
        });

        if (!existExercise) {
            return res.status(400).send(`Exercise doesn't exist`);
        }

        const existingExerciseResult = await prisma.userexercises.findUnique({
            where:{
                idexercise_iduser: {
                    iduser: iduser,
                    idexercise: idexercise,
                  },
            }
        })
        //console.log(existingExerciseResult)
        if(existingExerciseResult){
            const userResult = await prisma.userexercises.update({
                where:{
                    idexercise_iduser: {
                        iduser: iduser,
                        idexercise: idexercise,
                      },
                },
                data:{
                    results
                }});    
            updateScores(existExercise.skillID, existUser);
            return res.status(201).send(`User result updated successfully`)
        }

        const userResult = await prisma.userexercises.create({
            data:{
                iduser,
                idexercise,
                results,
            }});
            
        updateScores(existExercise.skillID, existUser);

        return res.status(201).send(`User result registered successfully`)
    };

    exports.updateExerciseResult = async (req, res) => {
        var { iduser, idexercise } = req.params;
        iduser = Number(iduser);
        idexercise = Number(idexercise);
        const { rol, results} = req.body;
        
        if (!(iduser && idexercise && results)) {
            return res.status(400).send("Missing required fields");
        }

        
        const existUser = await prisma.user.findUnique({
            where: { iduser:iduser },
        });

        if (!existUser) {
            return res.status(400).send(`User doesn't exist`);
        }

        const existExercise = await prisma.exercise.findUnique({
            where: { idexercise:idexercise },
        });

        if (!existExercise) {
            return res.status(400).send(`Exercise doesn't exist`);
        }


        const existingExerciseResult = await prisma.userexercises.findUnique({
            where:{
                idexercise_iduser: {
                    iduser: iduser,
                    idexercise: idexercise,
                  },
            }
        })
        if(!existingExerciseResult){
            return res.status(400).send("This userResult does not exist");
        }

        const userResult = await prisma.userexercises.update({
            where:{
                idexercise_iduser: {
                    iduser: iduser,
                    idexercise: idexercise,
                  },
            },
            data:{
                results
            }});
        
        return res.status(201).send(`User result updated successfully`)
        
    };

    exports.deleteExerciseResult = async (req, res) => {
        var { iduser, idexercise } = req.params;
        iduser = Number(iduser);
        idexercise = Number(idexercise);

        const existingExercise = await prisma.userexercises.findUnique({
            where:{
                idexercise_iduser: {
                    iduser: iduser,
                    idexercise: idexercise,
                  }
            }
        });

        if (!existingExercise) {
            return res.status(400).send(`Exercise doesn't exist`);
        }

        await prisma.userexercises.delete({
            where:{
                idexercise_iduser: {
                    iduser: iduser,
                    idexercise: idexercise,
                  },
            }
        });
        res.status(200).send(`Exercise with iduser: ${iduser} and idexercise:${idexercise} deleted successfully`);
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
