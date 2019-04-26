import Races from '../seed/Races';
import fetch from 'node-fetch'


test("signOn mutation signs on a person", async () => {
    let obj = {
        signOn: {
          eventId: "1",
          userId: "1",
          helmName: " ",
          boatName: " ",
          boatNumber: " ",
          pY: 0
        }
    }
  const signOn = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation signOn($input: SignOnInput!){
        signOn(input:$input){
          signOn{
            eventId
            userId
            helmName
            boatName
            boatNumber
            pY
          }
        }
      }`,
      variables: {
          input: obj
      }})
  })
  const signOnJson = await signOn.json();
  expect(signOnJson.data.signOn).toEqual(obj)
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation removeEvent($input: RemoveEventInput!){
        removeEvent(input: $input){
          event{
            eventId
          }
        }
      }`,
      variables: `{
      "input": {
        "event":{
          "eventId": "3"
        } 
      }
    }`})
  })
  const responseJson = await response.json();
  //expect(responseJson.data.removeEvent).toEqual({event:{eventId:obj.event.eventId}});
  const check = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `query {
        allEvents{
          eventId
          eventName
          eventTimeStamp
        }
      }`})
  });
  const json = await check.json();
  expect(json.data.allEvents).not.toContain(obj)
})
