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

  const body = JSON.parse(event.body);

  let results = (await db.fetchConnections()).map(elem => {
    const client = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });
    return ws.send(elem.pk,
      body.content
      , client);
  })

  await Promise.all(results);
  return success;
}

// oh my... this got out of hand refactor for sanity
async function broadcast(event, context) {
  // info from table stream, we'll learn about connections
  // disconnections, messages, etc
  // get all connections for channel of interest
  // broadcast the news
  const results = event.Records.map(async record => {
    switch (record.dynamodb.Keys["type_id"].S.split("_")[1]) {
      case "signOn": {
        switch (record.eventName) {
          case "INSERT": {
          }
          case "REMOVE": {

            event.body = {
              "action": "sendMessage",
              "content": {
                  "type": "removePerson",
                  "payload": {
                      "eventId": (record.dynamodb.Keys[eventId].S),
                      "userId":  (record.dynamodb.Keys["type_id"].S.split("_")[0])
                  }
              }
          }
          sendMessage(event, context)
          }
        }
      }

      case "lap": {
        switch (record.eventName) {
          case "INSERT": {
          }
          case "MODIFY": {

          }
          case "REMOVE": {

          }

        }
      }
    }
    switch (record.dynamodb.Keys[db.Primary.Key].S.split("|")[0]) {
      // Connection entities
      case db.Connection.Entity:
        break;

      // Channel entities (most stuff)
      case db.Channel.Entity:
        // figure out what to do based on full entity model

        // get secondary ENTITY| type by splitting on | and looking at first part
        switch (record.dynamodb.Keys[db.Primary.Range].S.split("|")[0]) {
          // if we are a CONNECTION
          case db.Connection.Entity: {
            let eventType = "sub";
            if (record.eventName === "REMOVE") {
              eventType = "unsub";
            } else if (record.eventName === "UPDATE") {
              // currently not possible, and not handled
              break;
            }

            // A connection event on the channel
            // let all users know a connection was created or dropped
            const channelId = db.parseEntityId(
              record.dynamodb.Keys[db.Primary.Key].S
            );
            const subscribers = await db.fetchChannelSubscriptions(channelId);
            const results = subscribers.map(async subscriber => {
              const subscriberId = db.parseEntityId(
                subscriber[db.Channel.Connections.Range]
              );
              return wsClient.send(
                subscriberId, // really backwards way of getting connection id
                {
                  event: `subscriber_${eventType}`,
                  channelId,

                  // sender of message "from id"
                  subscriberId: db.parseEntityId(
                    record.dynamodb.Keys[db.Primary.Range].S
                  )
                }
              );
            });

            await Promise.all(results);
            break;
          }

          // If we are a MESSAGE
          case db.Message.Entity: {
            if (record.eventName !== "INSERT") {
              return success;
            }

            // We could do interesting things like see if this was a bot
            // or other system directly adding messages to the dynamodb table
            // then send them out, otherwise assume it was already blasted out on the sockets
            // and no need to send it again!
            break;
          }
          default:
            break;
        }

        break;
      default:
        break;
    }
  });

  await Promise.all(results);
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
