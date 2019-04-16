
import * as db from './dynamo';

export const allBoatData = ()=> {
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
  
  export const createBoat = (args) => {
    let params = {
      TableName: "BoatData",
      Item: {
        boatName: args.boatData.boatName,
        crew: args.boatData.crew,
        pY: args.boatData.pY
      },
      ReturnValues: "ALL_OLD"
    }
    return {boatData: db.createItem(params)}
    }