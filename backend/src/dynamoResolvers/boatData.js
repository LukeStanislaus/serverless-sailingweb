
import * as db from './dynamo';

export const allBoatData = async ()=> {
    let params = {
      TableName: "BoatData",    
      AttributesToGet: [
        'boatName',
        'pY',
        'crew',
      ],
    }
    return await db.scan(params)
  }
  
export const createBoat = async (args) => {
  let params = {
    TableName: "BoatData",
    Item: {
      boatName: args.boatData.boatName,
      crew: args.boatData.crew,
      pY: args.boatData.pY
    },
    ReturnValues: "ALL_OLD"
  }
  await db.createItem(params)
  return {boatData: params.Item}
  }

