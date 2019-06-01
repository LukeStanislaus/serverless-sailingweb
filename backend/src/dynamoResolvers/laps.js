import * as db from './dynamo'
import uuid4v from 'uuid/v4'
export const createLap =async  (args) => {
  const lapId= uuid4v();
  let params = {
    TableName: "Races",
    Item: {
      ...args, type_id: "lap_" + lapId
    },
    ReturnValues: "ALL_OLD"
  }
  const res = await db.createItem(params)
  return {...res, lapId: lapId}
}


export const getLapsOfRace = async (args) => {
  let params = {
    TableName: "Races",
    KeyConditionExpression: 'eventId = :eventId and begins_with(type_id, :type_id)',
    ExpressionAttributeValues: {
      ':eventId': args.eventId,
      ':type_id': "lap_"
    }
  }
  const array = await db.queryItem(params);
  return array.map(elem => {
    return {
      userId: elem.userId,
      eventId: elem.eventId,
      lapTime: elem.lapTime,
      lapId: elem.type_id.split("_")[1]
    }
  })
}
export const updateLap = async (args) => {

  if (args.LapData.lapTime == null) {

    const result = {
      DeleteRequest: {
        Key: { eventId: args.LapData.eventId, type_id: "lap_" + args.LapData.lapId }
      }
    }

    const params = {
      RequestItems: {
        'Races': [result]
      }
    };
    const res = await db.batchDelete(params, args);
    return { Lap: { ...(res.LapData) } }


  }
  else {

    const params = {
      TableName: "Races",
      Key: { eventId: args.LapData.eventId, type_id: "lap_" + args.LapData.lapId },
      UpdateExpression: "set #lapTime = :lapTime",
      ExpressionAttributeNames: { "#lapTime": "lapTime" },
      ExpressionAttributeValues: {
        ":lapTime": args.LapData.lapTime
      }
    }
    const res = await db.updateItem(params, args);
    return {
      Lap: {
        ...(res.LapData)
      }
    }
  }

}