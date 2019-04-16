import * as db from './dynamo';
import uuidv4 from 'uuid/v4'
export const allEvents = ()=> {
    let params = {
      TableName: "Races",    
      IndexName: "eventId-eventTimeStamp-index",
      AttributesToGet: [
        'eventId',
        'eventTimeStamp',
        'calendarData',
        'eventName'
      ],
    }
    return db.scan(params)
  }
  export const createEvent = (args) => {
    let params = {
      TableName: "Races",
      Item: {
        eventId: args.event.eventId,
        type_id: "event_"+uuidv4(),
        eventName: args.event.eventName,
        calendarData: args.event.calendarData,
        eventTimeStamp: args.event.eventTimeStamp
      },
      ReturnValues: "ALL_OLD"
    }
    return {event: db.createItem(params)}
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