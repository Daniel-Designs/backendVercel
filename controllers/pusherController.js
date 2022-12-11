const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Pusher = require('pusher');
const {pusher} = require('../Pusher/conection')

async function main() {

/*
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    //encrypted: true
  });*/

    exports.sendMessage = async (req, res) => {
        //console.log("Sending Message")
        const {iduser, body ,channelName} = req.body
        const payload = {
            idauthor:iduser,
            body
        };
        console.log(req.body)
       
        const result = await prisma.chat.findUnique({
            where:{channelname:channelName},
            select:{
                idchat:true
            }
        })
        //console.log(result);
        const newMsg = await prisma.message.create({
            data:{
                idauthor:iduser,
                idchat:result.idchat,
                body:body
            }
        });

        const chatUpdate = await prisma.chat.update({
            where:{channelname:channelName},
            data:{
                timelastmsg:newMsg.timestmp
            }
        })
        payload.timestmp = newMsg.timestmp; 
        pusher.trigger(channelName, 'message', payload);
        pusher.trigger(channelName, 'update', payload);
        res.send("Sended")
    };

    exports.authUser = async (req, res) => {
        //console.log(req.query)
        const { socket_id, channel_name, name, userLocation } = req.body;
        const userID = req.body.iduser;
        //console.log(socket_id, channel_name, name )
        const presenceData = {
        user_id: userID,
        user_info: { name },
        };
        const authResponse = pusher.authorizeChannel(socket_id, channel_name, presenceData);
        //console.log(authResponse);
       
        res.send(authResponse);

    };

    exports.createChat = async (req, res) => {
    
        
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
