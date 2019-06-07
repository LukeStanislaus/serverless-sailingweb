import React from 'react'
import RaceRow from './raceRow'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'


const GetLapsOfRace = gql`
query lapsOfRace($input: GetLapsOfRaceInput!, $eventInput: SpecificEventInput!, $raceStartInput: GetRaceStartInput!) {
    getLapsOfRace(input:$input){
      userId
      eventId
      lapTime
      lapId
    }

    specificEvent(input: $eventInput){
        userId
        helmName
        boatName
        boatNumber
        crew
        pY
        notes
        crewName
    }
  getRaceStart(input: $raceStartInput)
    }`


export default ({eventId, people, maxLaps}) => {
    const GetLapsOfRaceInput = {
        input: {
            eventId: eventId
        },
        eventInput:
        {
            eventData: {
                eventId: eventId
            }
        },
        raceStartInput: {
            eventId: eventId
        }

    }
    return <>
        <Query query={GetLapsOfRace} variables={GetLapsOfRaceInput}>{({ data, loading, error }) => {
            if (loading) return <tr />
            if (error) { console.log(error); return <tr></tr> }
            if (data.specificEvent.length === 0) return null
            const people = data.specificEvent.map((elem) => { return { helm: elem, laps: data.getLapsOfRace.filter(element => element.userId === elem.userId) } })
        
            const correctedTimes = people.map(elem => {
                if (elem.laps.length === 0) return {  eventId: eventId, userId: elem.helm.userId, correctedTime: null, __typename: "CorrectedTime" }
                const lastLapTime = elem.laps.sort((a, b) => a.lapTime - b.lapTime).reverse()[0].lapTime
                const elapsedTime = lastLapTime - data.getRaceStart
                const correctedTime = (elapsedTime / elem.helm.pY) * 1000;
                return { eventId: eventId, userId: elem.helm.userId, correctedTime: correctedTime, __typename: "CorrectedTime" }
            })
            let RaceRows = []
            let correctedTimesSorted = correctedTimes.sort((a,b)=> a.correctedTime - b.correctedTime)
            if (correctedTimesSorted.length === 0 ) return <tr></tr>
            let places = 1;
            correctedTimesSorted = correctedTimesSorted.map((elem)=> {
                return {...elem, place: elem.correctedTime? places++:null}})
            people.forEach((element, index) => {
                let arr = correctedTimesSorted.filter(elem => elem.userId === element.helm.userId)
                if (arr.length === 0) return <tr></tr>
                let correctedTime = arr[0].correctedTime
                RaceRows.push(<RaceRow eventId={eventId} key={index} place={arr[0].place} maxLaps={maxLaps} correctedTime={correctedTime} person={element} />)
            });
            return RaceRows
        }}

        </Query>
    </>
}