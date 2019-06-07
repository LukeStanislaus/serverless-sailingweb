import * as db from './dynamo';

export const signOn = (args)=> {
    let params = {
        TableName: "Races",
        Item: {...args.signOn, type_id: "signOn_"+ args.signOn.userId},
        ReturnValues: "ALL_OLD"
      }
      return {signOn: db.createItem(params)}
  }
  
export const specificEvent = (args) => {
    let params = {
      TableName: "Races", 
      KeyConditionExpression: 'eventId = :eventId and begins_with(type_id, :type_id)',   
      ExpressionAttributeValues: {
        ':eventId': args.eventData.eventId,
        ':type_id': "signOn_"
      }
    }
    return db.queryItem(params)
  }
  
export const removeFromRace = async (args) => {
  const result = {
    DeleteRequest: {
      Key: { eventId: args.RemoveFromRaceData.eventId, type_id: "signOn_" + args.RemoveFromRaceData.userId }
    }
  }

  const params = {
    RequestItems: {
      'Races': [result]
    }
  };
  const res = await db.batchDelete(params, args);
  return { RemoveFromRaceData: { ...(res.RemoveFromRaceData) } }


}