import fetch from 'node-fetch'

test('newlap creates a new lap', async ()=> {
    let obj = {
          eventId: "2",
          userId: "2",
          lapTime: 0
        
    }
  const newLap = await fetch('http://localhost:3000/dev/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation newLap ($input:CreateLapInput!){
        createLap(input:$input){
          eventId
          userId
          lapId
          lapTime
        }
      }`,
      variables: {
          input: obj
      }})
  })
  const newLapJson = await newLap.json()
  expect(newLapJson.data.createLap.userId).toEqual("2")

  let obj1 = {
    eventId: "2"
  }
  const getLap = await fetch('http://localhost:3000/dev/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `query getLap ($input:GetLapsOfRaceInput!){
        getLapsOfRace(input:$input){
          userId
          lapTime
          lapId
          eventId
        }
      }`,
      variables: {
          input: obj1
      }})
  })
  const getLapsJson = await getLap.json()
  expect(getLapsJson.data.getLapsOfRace[0].userId).toEqual("2")
  

})
test('getLaps returns laps', async ()=> {


let obj1 = {
  eventId: "1"
}
const getLap = await fetch('http://localhost:3000/dev/graphql', {
  method: 'post',
  body: JSON.stringify({
    query: `query getLap ($input:GetLapsOfRaceInput!){
      getLapsOfRace(input:$input){
        userId
        lapTime
        lapId
        eventId
      }
    }`,
    variables: {
        input: obj1
    }})
})
const getLapsJson = await getLap.json()
expect(getLapsJson.data.getLapsOfRace[0].lapId).toEqual("0")

})
test('updateLap removes lap', async ()=> {
  let obj1 = {
    LapData: {
      eventId: "3",
      lapId: "3"
    }
}
  const updateLap = await fetch('http://localhost:3000/dev/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation updateLap($input: UpdateLapInput!){
        updateLap(input: $input){
          Lap {
            eventId
            lapTime
            lapId
          }
        }
      }`,
      variables: {
          input: obj1
      }})
  })
  const updateLapJson = await updateLap.json()
  expect(updateLapJson.data.updateLap.Lap.eventId).toEqual("3")

})

test('updateLap updates lap', async ()=> {
  let obj1 = {
    LapData: {
      eventId: "4",
      lapId: "4",
      lapTime: 1
    }
}
  const updateLap = await fetch('http://localhost:3000/dev/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation updateLap($input: UpdateLapInput!){
        updateLap(input: $input){
          Lap {
            eventId
            lapTime
            lapId
          }
        }
      }`,
      variables: {
          input: obj1
      }})
  })
  const updateLapJson = await updateLap.json()
  expect(updateLapJson.data.updateLap.Lap.lapTime).toEqual(1)

})