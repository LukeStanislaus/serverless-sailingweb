import React from 'react'
import RaceRow from './raceRow'
import { useQuery } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
const GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START = loader('../graphqlQueries/GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START.graphql')
const ORDER_BY = loader("../graphqlQueries/ORDER_BY.graphql")


export default ({ eventId, maxLaps }) => {
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
    const { data, loading, error } = useQuery(GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START,
        { variables: GetLapsOfRaceInput })
    console.log(data);
    if (loading) return <tr />
    if (error) { console.log(error); return <tr></tr> }
    if (data.specificEvent.length === 0) return null
    const peoplel = data.specificEvent.map((elem) => { return { helm: elem, laps: data.getLapsOfRace.filter(element => element.userId === elem.userId) } })

    const correctedTimes = peoplel.map(elem => {
        if (elem.laps.length === 0) return { eventId: eventId, userId: elem.helm.userId, correctedTime: null, __typename: "CorrectedTime" }
        const lastLapTime = elem.laps.sort((a, b) => a.lapTime - b.lapTime).reverse()[0].lapTime
        const elapsedTime = lastLapTime - data.getRaceStart
        const correctedTime = Math.floor((Math.floor((elapsedTime / elem.helm.pY))/ elem.laps.length)*maxLaps);
        console.log(correctedTime);
        return { eventId: eventId, userId: elem.helm.userId, correctedTime: correctedTime, __typename: "CorrectedTime" }
    })
    let RaceRows = []
    let correctedTimesSorted = correctedTimes.sort((a, b) => a.correctedTime - b.correctedTime)
    if (correctedTimesSorted.length === 0) return <tr></tr>
    let places = 1;
    correctedTimesSorted = correctedTimesSorted.map((elem) => {
        return { ...elem, place: elem.correctedTime ? places++ : null }
    })
    peoplel.forEach((element, index) => {
        let arr = correctedTimesSorted.filter(elem => elem.userId === element.helm.userId)
        if (arr.length === 0) return <tr></tr>
        let correctedTime = arr[0].correctedTime
        RaceRows.push({eventId: eventId, key:index, place:arr[0].place, maxLaps:maxLaps, correctedTime:correctedTime, person:element})
    });
    function toLowerCaseHelper(obj){
        if(obj == null || obj === undefined) return null
        return obj.toLowerCase()
    }
    const comparisons = {

        "Helm Name": (a, b) => toLowerCaseHelper(a.person.helm.helmName) > toLowerCaseHelper(b.person.helm.helmName),
        "Boat Class": (a, b) => toLowerCaseHelper(a.person.helm.boatName) > toLowerCaseHelper(b.person.helm.boatName),
        "Sail Number": (a, b) => toLowerCaseHelper(a.person.helm.boatNumber) > toLowerCaseHelper(b.person.helm.boatNumber),
        "Place": (a, b) => a.place > b.place,
        "Corrected Time": (a, b) => a.correctedTime > b.correctedTime,

    }
    if (true) {
        console.log("beforequery");
        const { data, loading, error } = useQuery(ORDER_BY);
        if (loading) return <tr />
        if (error) { console.log(error); return <tr></tr> }
        console.log(data.orderBy.type);
        const sorted = RaceRows.sort(data.orderBy.type==null? (a,b)=>true:comparisons[data.orderBy.type])
        console.log(sorted);
let items= (data.orderBy.reverse ? sorted.reverse() : sorted).map(elem=><RaceRow eventId={elem.eventId} key={elem.key} place={elem.place} maxLaps={elem.maxLaps} correctedTime={elem.correctedTime} person={elem.person} />)
      return <>{items}</>
    }
}