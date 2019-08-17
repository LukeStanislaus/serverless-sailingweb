
const db = require("./db")

async function send(ConnectionId, payload, client){


        console.log(ConnectionId, payload)
        await client.postToConnection({
            ConnectionId: ConnectionId,
            Data: JSON.stringify(payload)
        }).promise().catch(async err => {
            console.log(JSON.stringify(err))
          
            if (err.statusCode === 410) {
                // unsub all channels connection was in

                console.log(`[wsClient][send][postToConnection] Found stale connection, deleting ${ConnectionId}:`);

                
                  await db.Client.delete({
                        TableName: db.Table,
                        Key: {
                            [db.Channel.Connections.Key]: `${ConnectionId}`
                        }
                    }).promise()
            

            }
        });

        return true;
    }


module.exports = {
    send
}