const db = require("./db");
const ws = require("./websocket-client");
const sanitize = require("sanitize-html");
const AWS = require('aws-sdk');

const success = {
  statusCode: 200
};

async function connectionManager(event, context) {
  const client = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  if (event.requestContext.eventType === "CONNECT") {
    // sub general channel
    await subscribeConnection(
      db.parseEntityId(event)
    );

    return success;
  } else if (event.requestContext.eventType === "DISCONNECT") {
    // unsub all channels connection was in

    return success;
  }
}

async function defaultMessage(event, context) {

  const client = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  await ws.send(event, {
    event: "error",
    message: "invalid action type"
  }, client);

  return success;
}

async function sendMessage(event, context) {
  // save message for future history
  // saving with timestamp allows sorting
  // maybe do ttl?
  let body = null
  try {
    body = JSON.parse(event.body);
  }
  catch{
    body = event.body
  }
  let results = (await db.fetchConnections()).forEach(async (elem) => {
    const client = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: "https://c7s4ipb33a.execute-api.us-east-1.amazonaws.com/dev"
    });
    await ws.send(elem.pk,
      body.content
      , client);
  })

  return success;
}
async function broadcastMessage(data) {
  console.log("broadcast message")
  const items = (await db.fetchConnections()).map(elem=>{
     console.log("mapping connections to sending")
     return ws.send(elem.pk, data);
  })
  await Promise.all(items)
}
// oh my... this got out of hand refactor for sanity
async function broadcast(event, context) {
  // info from table stream, we'll learn about connections
  // disconnections, messages, etc
  // get all connections for channel of interest
  // broadcast the news

  console.log(JSON.stringify(event))
  const results = event.Records.map(record=> {
    const eventId = (record.dynamodb.Keys.eventId.S)
    const userId = (record.dynamodb.Keys.type_id.S.split("_")[1])
    switch (record.dynamodb.Keys.type_id.S.split("_")[0]) {
      case "signOn": {
        switch (record.eventName) {
          case "INSERT": {
            const newImage = record.dynamodb.NewImage
            const data = {
              type: "signOn",
              payload: {
                eventId: eventId,
                userId: newImage.userId.S,
                helmName: newImage.helmName.S,
                boatName: newImage.boatName.S,
                boatNumber: newImage.boatNumber.S,
                pY: newImage.pY.N?newImage.pY.N:null,
                notes: newImage.notes.S?newImage.notes.S:null,
                crewName: newImage.crewName.S?newImage.crewName.S:null
              }
            }
            return broadcastMessage(data)
          }
          case "REMOVE": {
            const data = {
              type: "removePerson",
              payload: {
                eventId: eventId,
                userId: userId
              }
            }
            return broadcastMessage(data)
          }
        
        default:{return}
        }
      }

      case "lap": {
        switch (record.eventName) {
          case "INSERT": {

            const newImage = record.dynamodb.NewImage
            const data = {
              type: "newLap",
              payload: {
                eventId: eventId,
                userId: newImage.userId.S,
                lapId: (record.dynamodb.Keys.type_id.S.split("_")[1]), // in a lap, the lapid is part of type_id, such is why we cant use the userid for above
                lapTime: parseInt(newImage.lapTime.N)
              }
            }
            return broadcastMessage(data)
          }
          case "MODIFY": {
            const newImage = record.dynamodb.NewImage
            const data = {
              type: "updateLap",
              payload: {
                eventId: eventId,
                userId: newImage.userId.S,
                lapId: (record.dynamodb.Keys.type_id.S.split("_")[1]), // in a lap, the lapid is part of type_id, such is why we cant use the userid for above
                lapTime: parseInt(newImage.lapTime.N)
              }
            }
            return broadcastMessage(data)
          }
          case "REMOVE": {
            const oldImage = record.dynamodb.OldImage
            const data = {
              type: "updateLap",
              payload: {
                eventId: oldImage.eventId.S,
                lapId: (record.dynamodb.Keys.type_id.S.split("_")[1]),
                lapTime: null
              }
            }
            return broadcastMessage(data)
          }

        }
      }

      case "event": {
        switch (record.eventName) {
          case "MODIFY": {
            
            const newImage = record.dynamodb.NewImage
            const data = {
              type: "updateStartTime",
              payload: {
                eventId: eventId,
                startTime: parseInt(newImage.startTime.N)
              }
            }
            return broadcastMessage(data)
          }

        }
      }
    }
  });
  await Promise.all(results)
  return success;
}



// module.exports.loadHistory = async (event, context) => {
//   // only allow first page of history, otherwise this could blow up a table fast
//   // pagination would be interesting to implement as an exercise!
//   return await db.Client.query({
//     TableName: db.Table
//   }).promise();
// };


async function subscribeConnection(connectionId) {
  await db.Client.put({
    TableName: db.Table,
    Item: {
      [db.Channel.Connections.Key]: connectionId

    }
  }).promise();

  // Instead of broadcasting here we listen to the dynamodb stream
  // just a fun example of flexible usage
  // you could imagine bots or other sub systems broadcasting via a write the db
  // and then streams does the rest
  return success;
}

module.exports = {
  connectionManager,
  defaultMessage,
  sendMessage,
  broadcast
};
