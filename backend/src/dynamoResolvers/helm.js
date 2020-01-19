import * as db from './dynamo';
import uuidv4 from 'uuid/v4'

export const removePerson = async ({RemovePersonData: {name, boatName, boatNumber, pY}}) => {
  let getParams = {
    TableName: "Races",
    KeyConditionExpression: "eventId = :eventId and begins_with(type_id, :type_id)",
    ExpressionAttributeValues: {
      ':eventId': "person",
      ":type_id": name,
    } 
  };
  let result = await db.queryItem(getParams)
  let item = result.filter(elem=> elem.pY === pY && elem.boatName === boatName && elem.boatNumber === boatNumber)
  if (item.length != 0) {
    let req = item.map(elem => {
      return {
        DeleteRequest: {
          Key: { eventId: elem.eventId, type_id: elem.type_id }
        }
      }
    })
    let params = {
      RequestItems: {
        'Races': req
      }
    };
    return db.batchDelete(params, {RemovePersonPayloadData: item[0]})
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
    await db.createItem(params);
    return {newPerson: params.Item}
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