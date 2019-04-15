
import * as db from './dynamo';

export const signOn = (args)=> {
    let params = {
        TableName: "SignOn",
        Item: args,
        ReturnValues: "ALL_NEW"
      }
      return db.createItem(params, {boatData:args})
  }
  
  export const specificRace = (args) => {
    let params = {
      TableName: "SignOn", 
      KeyConditionExpression: 'eventId = :eventId',   
      ExpressionAttributeValues: {
        ':eventId': args.eventId
      }
    }
    return db.queryItem(params)
  }
  