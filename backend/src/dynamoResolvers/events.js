import * as db from './dynamo';
import uuidv4 from 'uuid/v4'

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
  let updatedRes = res.map(elem => {
    elem.eventTimeStamp = elem.eventTimeStamp.toString();
    return elem
  })
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
      eventTimeStamp: parseInt(args.event.eventTimeStamp),
      finished: false
    }
  }
  await db.createItem(params)
  return { event: params.Item }
}
export const recentEvents = async (args) => {
  let params = {
    TableName: "Races",
    IndexName: "eventId-eventTimeStamp-index",
    FilterExpression: "eventTimeStamp between :start and :end",
    ExpressionAttributeValues: {
      ':start': parseInt(args.range.start),
      ':end': parseInt(args.range.end)
    }
  }
  let res = await db.scan(params)
  res = res.map(elem=>{
    elem.finished = elem.finished?elem.finished:false
  return elem
  })
  return res
}

export const startRace = async (args) => {
  const params = {
    TableName: "Races",
    Key: { eventId: args.StartRaceData.eventId, type_id: "event_" + args.StartRaceData.eventId },
    UpdateExpression: "set #startTime = :startTime",
    ExpressionAttributeNames: { "#startTime": "startTime" },
    ReturnValues: "ALL_NEW",
    ExpressionAttributeValues: {
      ":startTime": args.StartRaceData.startTime?parseInt(args.StartRaceData.startTime):null
    }
  }
  let res = await db.updateItem(params, args);
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
  let startRaceNullable= array[0] ?  array[0].startTime.toString():null  // consider if event doesnt exist, or start time not set
  return startRaceNullable? startRaceNullable.toString():null
}

export const updateRace = async ({ UpdateRaceInputData: { finished, startTime, eventId } }) => {

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
      ":startTime": parseInt(startTime)
    }
  }
  const res = await db.updateItem(params);
  return { UpdateRacePayloadData: res.Attributes }
}
