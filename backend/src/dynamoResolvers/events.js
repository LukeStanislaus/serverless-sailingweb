import * as db from './dynamo';

export const getAllEvents = ()=> {
    let params = {
      TableName: "Events",    
      AttributesToGet: [
        'eventId',
        'eventTimeStamp',
        'calendarData',
        'eventName'
      ],
    }
    return db.scan(params)
  }
  export const createEvents = (args) => {
    let params = {
      TableName: "Events",
      Item: {
        eventId: args.eventId,
        eventName: args.eventName,
        calendarData: args.calendarData == null? " " : args.calendarData,
        eventTimeStamp: args.eventTimeSTamp
      },
      ReturnValues: "ALL_NEW"
    }
    return db.createItem(params, {result: "Success!"})
    }
export const recentEvents = (args) => {
    let params = {
      TableName: "Events",
      FilterExpression: "eventTimeStamp between :start and :end",
      ExpressionAttributeValues: {
        ':start': args.start,
        ':end': args.end
      }
    }
      return db.scan(params)
    }