import Races from '../seed/Races';
import fetch from 'node-fetch'



test("allEvents query returns event", async () => {

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `
      query{
        allEvents{
          eventId
          eventName
          eventTimeStamp
        }
      }`})
  })
  const result = await response.json()
  const Filter = Races.filter(elem => elem.type_id.split("_")[0] == "event")
  const RacesEvents = Filter.map(elem => {
    return {
      eventId: elem.eventId,
      eventName: elem.eventName,
      eventTimeStamp: elem.eventTimeStamp
    }
  })
  expect(result.data.allEvents).toEqual(RacesEvents);
})


test("recentEvents query returns event", async () => {

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `
        query recentEvents($input: RecentEventsInput!){
            recentEvents(input: $input){
              eventId
              eventName
              eventTimeStamp
            }
          }`, variables: `{
            "input": {
              "range":
              {
                "start": 0,
                "end": 0
              }
            }
          }`})
  })
  const result = await response.json()
  const Filter = Races.filter(elem => elem.eventTimeStamp == 0)
  const RacesEvents = Filter.map(elem => {
    return {
      eventId: elem.eventId,
      eventName: elem.eventName,
      eventTimeStamp: elem.eventTimeStamp
    }
  })
  expect(result.data.recentEvents).toEqual(RacesEvents);
})


test("specificEvent query returns event", async () => {

  const response = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `
          query specificEvent($input: SpecificEventInput!){
            specificEvent(input: $input){
          eventId
              userId
              helmName
              boatName
              boatNumber
            }
          }`, variables: `{
            "input": {
          "eventData": {
            "eventId": "2"
          }
          }}`})
  })
  const result = await response.json()
  const Filter = Races.filter(elem => elem.type_id.split("_")[0] == "signOn");
  const RacesEvents = Filter
    .map(elem => {

      return {
        eventId: elem.eventId,
        userId: elem.userId,
        helmName: elem.helmName,
        boatName: elem.boatName,
        boatNumber: elem.boatNumber
      }
    })
  expect(result.data.specificEvent).toEqual(RacesEvents);
})


test("createEvent mutation creates and returns event", async () => {
  const input = {
    input: {
      event:{
        eventName: "test",
        eventTimeStamp: 0
      } 
    }
  }
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation createEvent($input: CreateEventInput!){
        createEvent(input: $input){
          event{
            eventName
            eventTimeStamp
          }
        }
      }`,
      variables: input
    })
  })
  const result = await response.json()
  expect(result.data.createEvent).toEqual(input.input);
  const check = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `query {
        allEvents{
          eventName
          eventTimeStamp
        }
      }`})
  });
  const json = await check.json();
  expect(json.data.allEvents).toContainEqual(input.input.event)
  const remove = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation removeEvent($input: RemoveEventInput!){
        removeEvent(input: $input){
          event{
            eventId
          }
        }
      }`,
      variables: input
    })
  })
})


test("removeEvent mutation removes event", async () => {
  const obj = {"event":{
    "eventName": "test",
    "eventTimeStamp": 0
  }}
  const create = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation createEvent($input: CreateEventInput!){
        createEvent(input: $input){
          event{
            eventId
            eventName
            eventTimeStamp
          }
        }
      }`,
      variables: `{
      "input": {
        "event":{
          "eventName": "test",
          "eventTimeStamp": 0
        } 
      }
    }`})
  })
  const createJson= await  create.json();
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
      variables: {
      input: {
        event:{
          eventId: createJson.data.createEvent.event.eventId
        } 
      }
    }})
  })
  const responseJson = await response.json();
  expect(responseJson.data.removeEvent.event.eventId).toEqual(createJson.data.createEvent.event.eventId);
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
  expect(json.data.allEvents).not.toContainEqual(obj)
})

test('startRace starts the race', async () => {
  const inputObj = {
    input: {
      StartRaceData: {
        startTime: 0,
        eventId: "0"
      }
    }
  }
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation startRace($input: StartRaceInput!){
        startRace(input:$input){
          StartRaceData{
            startTime
            eventId
          }
        }
      }`,
      variables: inputObj})
  })
  const responseJson = await response.json();
  expect(responseJson.data.startRace.StartRaceData).toEqual(inputObj.input.StartRaceData);
  
})

test('getRaceStart gets the start time of the race', async () => {
  const inputObj = {
    input: {
      StartRaceData: {
        startTime: 0,
        eventId: "4"
      }
    }
  }
  await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation startRace($input: StartRaceInput!){
        startRace(input:$input){
          StartRaceData{
            startTime
            eventId
          }
        }
      }`,
      variables: inputObj})
  })
  const getRaceStartInputObj = {
    input: {
      eventId: "4"
    }
  }
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `query getRaceStart($input: GetRaceStartInput!) {
        getRaceStart(input: $input)
      }
      `,
      variables: getRaceStartInputObj})
  })
  const responseJson = await response.json();
  expect(responseJson.data.getRaceStart).toEqual(0)
  
})

test("startRace removes a race start time", async ()=> {

  const StartRaceInputObj = {
    input: {StartRaceData:{
      eventId: "4",
      startTime: null
    }
    }
  }
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'post',
    body: JSON.stringify({
      query: `mutation startRace($input:StartRaceInput!){
        startRace(input:$input){
          StartRaceData{
          eventId
          startTime
          }
        }
      }
      `,
      variables: StartRaceInputObj})
  })
  const res = await response.json()
expect(res.data.startRace.StartRaceData.startTime).toEqual(null)
})