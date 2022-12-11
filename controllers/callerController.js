const { PrismaClient } = require("@prisma/client");
const path = require("path");
const prisma = new PrismaClient();

async function main() {
  exports.getCalls = async (req, res) => {
    const allCalls = await prisma.calls.findMany();
    res.json(allCalls);
  };

  exports.getMyCalls = async (req, res) => {
    const { userID } = req.params;
    const myCalls = await prisma.calls.findMany({
      where: {
        chat: {
          OR: [{ usero: Number(userID) }, { usert: Number(userID) }],
        },
      },
      select: {
        idcall: true,
        timestmp: true,
        idcalled: true,
        timeduration: true,
        chat: {
          select: {
            idchat: true,
            usero: true,
            usert: true,
            user_chat_useroTouser: {
              select: {
                name: true,
                username: true,
                pfp: true,
              },
            },
            user_chat_usertTouser: {
              select: {
                name: true,
                username: true,
                pfp: true,
              },
            },
          },
        },
      },
      orderBy: {
        timestmp: "desc",
      },
    });
    return res.status(200).send(myCalls);
  };

  exports.getCallByID = async (req, res) => {
    const { idcall } = req.params;
    const call = await prisma.calls.findUnique({
      where: { idcall: Number(idcall) },
    });

    res.json(call);
  };

  exports.callUser = async (req, res) => {
    const { receiverID } = req.params;
    const { idchat } = req.body;

    if (!(receiverID && idchat)) {
      return res.status(400).send("Missing chat or user data");
    }

    const chat = await prisma.chat.findUnique({
      where: { idchat: Number(idchat) },
    });

    const user = await prisma.user.findUnique({
      where: { username: receiverID },
    });

    if (chat && user) {
      console.log(chat.idchat, user.iduser);
      if (user.iduser === chat.usero || user.iduser === chat.usert) {
        const call = await prisma.calls.create({
          data: {
            idchat: chat.idchat,
            idcalled: user.iduser,
          },
        });
        console.log(call.timestmp);
        res.status(201).json({
          idcall: call.idcall,
          msg:
            `Call ${call.idcall} registered successfully\n` +
            `Called: ${receiverID} with id: ${call.idcalled}`,
        });
      } else {
        return res.status(400).send("Invalid chat or user");
      }
    } else {
      return res.status(400).send("Missing chat or user data");
    }
  };

  exports.endCall = async (req, res) => {
    const { idcall } = req.params;

    const call = await prisma.calls.findUnique({
      where: { idcall: Number(idcall) },
    });

    if (call) {
      let seconds = new Date();
      seconds = Math.floor((seconds - call.timestmp) / 1000);
      const updatedCall = await prisma.calls.update({
        where: { idcall: Number(idcall) },
        data: {
          timeduration: seconds,
        },
      });
      res
        .status(200)
        .send(`Ended call: ${updatedCall.idcall} which lasted: ${seconds} s.`);
    } else {
      return res.status(400).send("Call doesn't exist");
    }
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
