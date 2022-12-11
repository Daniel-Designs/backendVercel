const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {pusher} = require('../Pusher/conection')

async function main() {

    exports.getChannelMessages = async (req, res) => {
        const {channelName} = req.body; 
        //console.log(req.body);
        const messages = await prisma.chat.findUnique({
            where:{channelname:channelName},
            select:{
                idchat:true,
                message: {
                    orderBy:{timestmp:'asc'}
                }
            }
        })
       return res.status(200).send(messages);
    };

    exports.getLasMessages = async (req, res) => {
        const {channelName} = req.body; 
        //console.log(req.body);
        const result = await prisma.chat.findUnique({
            where:{channelname:channelName},
            select:{
                message:{
                    take:1,
                    orderBy:{
                        timestmp: 'desc'
                    }

                }
            }
        })
        console.log(result);

        return res.status(200).send(result);
    } 

    exports.readMessage = async(req,res) =>{
        const {idmsg,idchat,idauthor,iduser} = req.body
        //console.log(req.body) 
        if(idauthor == iduser){
            return res.status(200).send('Dont need to be updated')
        }
        const updated = await prisma.message.updateMany({
            where:{idchat:idchat},
            data:{read:true}
        })
        //console.log('mesaje read', updated)
        return res.status(200).send(updated)
    }

    exports.deleteMessage = async(req, res)=>{
        const {idchat,idauthor,iduser} = req.body
        console.log(idchat)
        if(!idchat){
            return res.status(200).send('IDCHAT incorrect')
        }
        console.log(idchat)

        const deleted = await prisma.message.deleteMany({
            where:{idchat:idchat}
        })

        pusher.trigger('newChat', 'channel', 'Se borraron los mensajes');
        return res.status(200).send(deleted)
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
