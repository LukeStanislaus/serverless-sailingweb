
const db = require("./db")
const AWS = require('aws-sdk');

async function send(ConnectionId, payload){
    const client = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: "https://c7s4ipb33a.execute-api.us-east-1.amazonaws.com/dev",
        logger: console
      });
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