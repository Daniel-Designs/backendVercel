// noinspection DuplicatedCode,JSUnresolvedVariable,JSUnresolvedFunction

const { PrismaClient } = require("@prisma/client");
const moment = require("moment");
const prisma = new PrismaClient();
const validator = require("validator");
  
async function main() {
    /* C R U D noteS TABLE */

    exports.getNotesByUser = async (req, res) => {
        const skip = Number(req.query.skip) || 0;
        const take = Number(req.query.take) || 10;
        const user = Number(req.params.user);
        
        console.log(`Get notes for user ${user}`)
        const notesCount = await prisma.note.count({ 
          where: {
            user: {
              is: {
                iduser: user,
              }
            },
          },
        });
        
        console.log(`GET All Notes, skip ${skip}, take ${take}, total ${notesCount}`)
        const allNotes = await prisma.note.findMany({
            skip,
            take,
            where: {
              user: {
                is: {
                  iduser: user,
                }
              },
            },
            select: {
                idnote: true,
                title: true,
                body: true,
                datelastmod: true,
                user: {
                  select: {
                    iduser: true,
                  },
                },
                labelnote: {
                  select: {
                    labeldesc: true,
                  },
                },
            },
        });
        res.json({
            notes: allNotes,
            total: notesCount
        });
    };

    exports.getnoteById = async (req, res) => {
        const { id } = req.params;
        const { iduser } = req.body;
        
        const onenote = await prisma.note.findUnique({
            where: { 
              idnote: Number(id),
            },
            select: {
              idnote: true,
              title: true,
              body: true,
              datecreated: true,
              datelastmod: true,
              user: {
                select: {
                  iduser: true,
                },
              },
              labelnote: {
                select: {
                  labeldesc: true,
                },
              },
          },
        });
        res.json(onenote);
    };

    exports.createnote = async (req, res) => {
        const {title, body, idlabel, iduser } = req.body;
       console.log("Create note:")
        console.log(req.body)

        if (!(title && body && idlabel && iduser)) {
            return res.status(400).send("Missing required fields");
        }

        if (!validator.isLength(title, 1, 50)) {
            return res.status(400).send("Invalid title");
        }
        
        if (!validator.isLength(body, 1, 600)) {
          return res.status(400).send("Invalid body");
        
        }
        const labelCorrect = await prisma.labelnote.findFirst({
            where: { idlabel: idlabel },
        });

        if (!labelCorrect) {
            return res.status(400).send("Invalid label of note");
        }

        const userExist = await prisma.user.findFirst({
            where: { iduser: iduser },
        });

        if (!userExist) {
            return res.status(400).send("Invalid user");
        }
        
        const date = moment().format();

        const note = await prisma.note.create({
            data: {
                title,
                body,
                author: iduser,
                label: idlabel,
                datelastmod: date,
                datecreated: date,              
            },
        });
        res.status(201).send(
            `note ${note.idnote} registered successfully`
        );
    };

    exports.updatenote = async (req, res) => {
        const { id } = req.params;
        const {title, body, idlabel, iduser } = req.body;
        
        const oldnote = await prisma.note.findUnique({
            where: { idnote: Number(id) },
        });

        if (!oldnote) {
            return res.status(400).send(`note doesn't exist`);
        }

        if (title && !validator.isLength(title, 1, 50)) {
          return res.status(400).send("Invalid title");
        }
        
        if (body && !validator.isLength(body, 1, 600)) {
          return res.status(400).send("Invalid body");
        
        }
        const labelCorrect = await prisma.labelnote.findFirst({
            where: { idlabel: idlabel },
        });

        if (idlabel && !labelCorrect) {
            return res.status(400).send("Invalid label of note");
        }
        
        const date = new Date().toJSON();

        const updatednote = await prisma.note.update({
            where: { idnote: Number(id) },
            data: {
                body,
                title,
                label: idlabel,
                datelastmod: date,
            },
        });
        res.status(200).send(
            `note ${updatednote.idnote} updated successfully`
        );
    };

    exports.deletenote = async (req, res) => {
        const { id } = req.params;
        
        const existingnote = await prisma.note.findUnique({
            where: { idnote: Number(id) },
        });

        if (!existingnote) {
            return res.status(400).send(`note doesn't exist`);
        }

        await prisma.note.delete({
            where: { idnote: Number(id) },
        });
        res.status(200).send(`note with id: ${id} deleted successfully`);
    };

    /*  C R U D noteS TOPIC TABLE  */

    exports.labels = async( req, res) => {
        const labels = await prisma.labelnote.findMany();
        return res.status(200).send(labels)
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
