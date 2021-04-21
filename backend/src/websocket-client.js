
const db = require("./db")
const AWS = require('aws-sdk');

async function send(ConnectionId, payload, client){

const data = JSON.stringify(payload)
        console.log(data)
        await client.postToConnection({
            ConnectionId: ConnectionId,
            Data: data
        }).promise().catch(async err => {
            console.log(JSON.stringify(err))
          
            if (err.statusCode === 410 || err.statusCode === 504) {
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
        console.log(`Message sent to ${ConnectionId}!`)
        return true;
    }


module.exports = {
    send
}