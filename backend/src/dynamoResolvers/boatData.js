
import * as db from './dynamo';

export const getAllBoatData = ()=> {
    let params = {
      TableName: "BoatData",    
      AttributesToGet: [
        'boatName',
        'pY',
        'crew',
      ],
    }
    return db.scan(params)
  }
  
  export const changeBoatData = (args) => {
    let params = {
      TableName: "BoatData",
      Item: {
        boatName: args.boatName,
        crew: args.crew,
        pY: args.py
      },
      ReturnValues: "ALL_NEW"
    }
    return db.createItem(params, {boatData:args})
    }