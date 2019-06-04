import * as db from './dynamo';
import uuidv4 from 'uuid/v4'

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