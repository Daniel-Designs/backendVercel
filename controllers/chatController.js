const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {pusher} = require('../Pusher/conection')

const validator = require("validator");
async function main() {
  exports.getChats = async (req, res) => {
    const allChats = await prisma.chat.findMany({
      select: {
        channelname: true,
        user_chat_useroTouser: {
          select: {
            name: true,
            username:true
          },
        },
        user_chat_usertTouser: {
          select: {
            name: true,
            username:true
          },
        },
        message: {
          take: 1,
          orderBy: {
            timestmp: "desc",
          },
        },
      },
    });

    return res.status(200).send(allChats);
  };

  exports.getChatById = async (req, res) => {
    const { iduser, usert } = req.body;
    const oneChat = await prisma.chat.findUnique({
      where: {
        usero_usert: {
          usero: iduser,
          usert,
        },
      },
    });
    const twoChat = await prisma.chat.findUnique({
      where: {
        usero_usert: {
          usero: usert,
          usert: iduser,
        },
      },
    });
    return res.status(200).send(oneChat);
  };

  exports.createChat = async (req, res) => {
    var { iduser, usert } = req.body;
    iduser = Number(iduser);
    usert = Number(usert);

    const channelname = "presence-" + iduser + "-" + usert;

    [useroExist, usertExist] = await Promise.all([
      prisma.user.findUnique({ where: { iduser } }),
      prisma.user.findUnique({ where: { iduser: usert } }),
    ]);
    if (!useroExist || !usertExist) {
      return res.status(400).send("Not valid users");
    }

    if (usert === iduser) {
      return res.status(400).send("Same users");
    }

    [chatExist, chatExist2] = await Promise.all([
      prisma.chat.findUnique({
        where: {
          usero_usert: {
            usero: iduser,
            usert,
          },
        },
        select: {
          idchat: true,
          channelname: true,
          user_chat_usertTouser: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.chat.findUnique({
        where: {
          usero_usert: {
            usero: usert,
            usert: iduser,
          },
        },
        select: {
          idchat: true,
          channelname: true,
          user_chat_useroTouser: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    if (chatExist) {
      chatExist.userR = chatExist.user_chat_usertTouser;
      return res.send(chatExist);
    }
    if (chatExist2) {
      chatExist2.userR = chatExist2.user_chat_useroTouser;
      return res.send(chatExist2);
    }
    const newChat = await prisma.chat.create({
      data: {
        usero: iduser,
        usert,
        channelname,
      },
      select: {
        idchat: true,
        channelname: true,
        user_chat_usertTouser: {
          select: {
            name: true,
          },
        },
      },
    });
    newChat.userR = newChat.user_chat_usertTouser;
    pusher.trigger('newChat', 'channel', newChat.channelname);
    return res.status(200).send(newChat);
  };

  exports.updateChat = async (req, res) => {};

  exports.deleteChat = async (req, res) => {};

  exports.myChats = async (req, res) => {
    const { iduser } = req.body;

    const oneChat = await prisma.chat.findMany({
      where: {
        OR: [
          {
            usero: iduser,
          },
          { usert: iduser },
        ],
      },
      select: {
        idchat: true,
        channelname: true,
        timelastmsg: true,
        user_chat_useroTouser: {
          select: {
            name: true,
            username: true,
          },
        },
        user_chat_usertTouser: {
          select: {
            name: true,
            username: true,
          },
        },
        message: {
          take: 1,
          orderBy: {
            timestmp: "desc",
          },
        },
      },
      orderBy: {
        timelastmsg: "desc",
      },
    });
    /*const twoChat = await prisma.chat.findMany({
            where: {usert:iduser},
            
            select:{
                idchat:true,
                channelname:true,
                timelastmsg:true,
                user_chat_useroTouser:{
                    select:{
                        name:true
                    }
                },
                user_chat_usertTouser:{
                    select:{
                        name:true
                    }
                },
                message:{
                    take:1,
                    orderBy:{
                        timestmp: 'desc'
                    }
                }
        }
        })

        const chats = [...new Set( [...oneChat, ...twoChat] )];
        chats.sort((chat1 , chat2)=>{
            if(chat1.timelastmsg && chat2.timelastmsg){
                return chat2.timelastmsg - chat1.timelastmsg;
            }else{
                return 0;
            }

        });*/
    //console.log(chats);
    //oneChat.reverse();
    return res.status(200).send(oneChat);
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
