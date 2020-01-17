import * as db from './dynamo';
import uuidv4 from 'uuid/v4'

export const removePerson = async (args) => {
  console.log(args);
  let getParams = {
    TableName: "Races",
    KeyConditionExpression: "eventId = :eventId and begins_with(type_id, :type_id) and boatName = :boatName and "+ 
    "boatNumber = :boatNumber and pY = :pY",
    ExpressionAttributeValues: {
      ':eventId': "person",
      ":type_id": args.RemovePersonData.name,
      ":boatName": args.RemovePersonData.boatName,
      ":boatNumber": args.RemovePersonData.boatNumber,
      ":pY": args.RemovePersonData.pY
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

export const newPerson = async (args) =>  {
  const userId = uuidv4();
    let params = {
        TableName: "Races",
        Item: {...args.newPersonData, type_id: args.newPersonData.name+"_"+ userId, eventId: "person"},
        ReturnValues: "ALL_OLD"
    }
    const obj = await db.createItem(params);
    return {newPerson: {...obj, userId: userId}}
}

export const allHelms = async (args) => {
  let params = {
    TableName: "Races", 
    KeyConditionExpression: 'eventId = :eventId',   
    ExpressionAttributeValues: {
      ':eventId': "person"
    }
  }
  const array = await db.queryItem(params);
    const li = array.map(elem => {return {...elem, userId: elem.type_id.split("_")[1]}})
    return li
  }

  export const getBoatsOfHelm = async (args) => {
    let params = {
      TableName: "Races", 
      KeyConditionExpression: 'eventId = :eventId and begins_with(type_id, :type_id)',   
      ExpressionAttributeValues: {
        ':eventId': "person",
        ':type_id': args.helmName+"_"
      }
    }
    const array = await db.queryItem(params);
    return array.map(elem => {return {boatName: elem.boatName, boatNumber: elem.boatNumber, pY: elem.pY, name: elem.name}})
    }