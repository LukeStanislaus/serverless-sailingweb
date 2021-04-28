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
  const signOn = await fetch('http://localhost:3000/dev/graphql', {
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
  const response = await fetch('http://localhost:3000/dev/graphql', {
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
  const check = await fetch('http://localhost:3000/dev/graphql', {
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

test("RemoveFromRace from removes someone from a race", async ()=>{
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
const signOn = await fetch('http://localhost:3000/dev/graphql', {
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
  const response = await fetch('http://localhost:3000/dev/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation removeFromRace($input:RemoveFromRaceInput!){
        removeFromRace(input:$input){
          RemoveFromRaceData{
            userId
          }
        }
      }`,
      variables: `{
        "input": {
          "RemoveFromRaceData": {
          "eventId": "1",
          "userId": "1"
          }
        }
      }`})
  })
  const responseJson = await response.json()
  expect(responseJson.data.removeFromRace.RemoveFromRaceData.userId).toEqual("1")
  const res = await fetch('http://localhost:3000/dev/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `query specificEvent($input:SpecificEventInput!){
        specificEvent(input:$input){
          helmName
        }
      }`,
      variables: `{
        "input": {"eventData": {
      "eventId": "1"
        }
      }
    }`})
  })
  const resJson= await res.json()
  expect(resJson.data.specificEvent.length).toEqual(0)

})