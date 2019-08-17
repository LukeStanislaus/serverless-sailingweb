const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

const db = {
    Table: "WebSocketTable",
    Primary: {
        Key: 'pk',
        Range: 'sk'
    },
    Connection: {
        Primary: {
            Key: 'pk',
            Range: 'sk'
        },
        Channels: {
            Index: 'reverse',
            Key: 'sk',
            Range: 'pk'
        },
        Prefix: 'CONNECTION|',
        Entity: 'CONNECTION'
    },
    Channel: {
        Primary: {
            Key: 'pk',
            Range: 'sk'
        },
        Connections: {
            Key: 'pk',
            Range: 'sk'
        },
        Messages: {
            Key: 'pk',
            Range: 'sk'
        },
        Prefix: 'CHANNEL|',
        Entity: 'CHANNEL'
    },
    Message: {
        Primary: {
            Key: 'pk',
            Range: 'sk'
        },
        Prefix: 'MESSAGE|',
        Entity: 'MESSAGE'
    }
}

const channelRegex = new RegExp(`^${db.Channel.Entity}\|`);
const messageRegex = new RegExp(`^${db.Message.Entity}\|`);
const connectionRegex = new RegExp(`^${db.Connection.Entity}\|`);

function parseEntityId(target){
    console.log('ENTITY ID A ', target)

    if(typeof target === 'object'){
        // use from raw event, only needed for connectionId at the moment
        target = target.requestContext.connectionId;
    } else {
        // strip prefix if set so we always get raw id
        target = target
                .replace(channelRegex, '')
                .replace(messageRegex, '')
                .replace(connectionRegex, '');
    }

    return target.replace('|', ''); // why?!
}

async function fetchConnections(){
    const results = await ddb.scan({
        TableName: db.Table
      }).promise();

      return results.Items;
}




const client = {
    ...db,
    parseEntityId,
    fetchConnections,
    Client: ddb
}

module.exports = client