import fetch from 'node-fetch'
import { notDeepEqual } from 'assert';
import BoatData from '../seed/BoatData';


test("allBoatData",  async () => {

  const response=  await fetch('http://localhost:3000/graphql', {
      method: 'post',
      body:JSON.stringify({query: `
      query{
        allBoatData{
          boatName
          crew
          pY
        }
      }
      `})
  })
  const result =await response.json()
  expect(result.data.allBoatData).toEqual(BoatData);
})