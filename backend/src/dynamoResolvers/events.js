import * as db from './dynamo';
import uuidv4 from 'uuid/v4'
import { CloudWatchLogs } from 'aws-sdk';

export const removeEvent = async (args) => {
  let getParams = {
    TableName: "Races",
    KeyConditionExpression: "eventId = :eventId",
    ExpressionAttributeValues: {
      ":eventId": args.event.eventId
    }
  };
  let result = await db.queryItem(getParams)
  if (result.length != 0) {
    result = result.map(elem => {
      return {
        DeleteRequest: {
          Key: { eventId: elem.eventId, type_id: elem.type_id }
        }
      }
    })
    let params = {
      RequestItems: {
        'Races': result
      }
    };
    return db.batchDelete(params, args)
  }
  else {
    return null;
  }
}

export const allEvents = async () => {
  let params = {
    TableName: "Races",
    IndexName: "eventId-eventTimeStamp-index",
    AttributesToGet: [
      'eventId',
      'eventTimeStamp',
      'calendarData',
      'eventName',
      'finished'
    ],
  }
  let res = await db.scan(params)
  let updatedRes = res.map(elem => elem.finished === undefined ? { finished: false, ...elem } : elem)
  return updatedRes
}
export const createEvent = async (args) => {
  const eventId = uuidv4();
  let params = {
    TableName: "Races",
    Item: {
      eventId: eventId,
      type_id: "event_" + eventId,
      eventName: args.event.eventName,
      calendarData: args.event.calendarData,
      eventTimeStamp: args.event.eventTimeStamp
    }
  }
  await db.createItem(params)
  return { event: params.Item }
}
export const recentEvents = (args) => {
  let params = {
    TableName: "Races",
    IndexName: "eventId-eventTimeStamp-index",
    FilterExpression: "eventTimeStamp between :start and :end",
    ExpressionAttributeValues: {
      ':start': args.range.start,
      ':end': args.range.end
    }
  }

  return db.scan(params)
}

export const startRace = async (args) => {
  const params = {
    TableName: "Races",
    Key: { eventId: args.StartRaceData.eventId, type_id: "event_" + args.StartRaceData.eventId },
    UpdateExpression: "set #startTime = :startTime",
    ExpressionAttributeNames: { "#startTime": "startTime" },
    ReturnValues: "ALL_NEW",
    ExpressionAttributeValues: {
      ":startTime": args.StartRaceData.startTime
    }
  }
  let res
  res = await db.updateItem(params, args);
  console.log(res.Attributes)
  return { StartRaceData: res.Attributes }
}

export const getRaceStart = async (args) => {
  let params = {
    TableName: "Races",
    KeyConditionExpression: 'eventId = :eventId and begins_with(type_id, :type_id)',
    ExpressionAttributeValues: {
      ':eventId': args.eventId,
      ':type_id': "event_" + args.eventId
    }
  }
  const array = await db.queryItem(params);
  let result = array[0] == undefined ? null : array[0].startTime
  return result

}

export const updateRace = async ({UpdateRaceInputData:{finished, startTime, eventId}}) => {

  const params = {
    TableName: "Races",
    Key: { eventId: eventId, type_id: "event_" + eventId },
    UpdateExpression: "Set #finished = :finished, #startTime = :startTime",
    ExpressionAttributeNames: {
      "#finished": "finished",
      "#startTime": "startTime"
    },
    ReturnValues: "ALL_NEW",
    ExpressionAttributeValues: {
      ":finished": finished,
      ":startTime": startTime
    }
  }
  const res = await db.updateItem(params);
  return { UpdateRacePayloadData: res.Attributes }
}