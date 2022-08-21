import React from 'react'
import RaceRow from './raceRow'
import { useQuery } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
import styled from 'styled-components'
let Tr = styled.tr`

:nth-child(even) {background-color: #f2f2f2;}
:hover {background-color: #dddddd;}
`
const GET_LAPS_OF_RACE_SPECIFIC_EVENT_GET_RACE_START_AND_ORDER_BY = loader('../graphqlQueries/GET_LAPS_OF_RACE_SPECIFIC_EVENT_GET_RACE_START_AND_ORDER_BY.graphql')

var oldData = [];
export default ({ eventId, maxLaps, viewOnly = false }) => {
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
    const { data, loading, error } = useQuery(GET_LAPS_OF_RACE_SPECIFIC_EVENT_GET_RACE_START_AND_ORDER_BY,
        { variables: GetLapsOfRaceInput })
    if (loading) return <tr />
    if (error) { return <tr></tr> }
    // if (data.specificEvent.length === 0) return <><Tr><td><div></div></td></Tr><Tr></Tr><Tr></Tr></>
    const people1 = data.specificEvent.map((elem) => { return { helm: elem, laps: 
        data.getLapsOfRace.filter(element => element.userId === elem.userId).map(elem => {return{...elem, 
            lapTime:parseInt(elem.lapTime)}})
    } })

    const correctedTimes = people1.map(elem => {
        if (elem.laps.length === 0) return { eventId: eventId, userId: elem.helm.userId, correctedTime: null, __typename: "CorrectedTime" }
        const lastLapTime = elem.laps.sort((a, b) => (a.lapTime) - (b.lapTime)).reverse()[0].lapTime
        const elapsedTime = (lastLapTime) - (data.getRaceStart)
        const correctedTime = Math.floor((Math.floor((elapsedTime / elem.helm.pY)) / elem.laps.length) * maxLaps);
        return { eventId: eventId, userId: elem.helm.userId, correctedTime: correctedTime, __typename: "CorrectedTime" }
    })
    let RaceRows = []
    let correctedTimesSorted = correctedTimes.sort((a, b) => a.correctedTime - b.correctedTime)
    //if (correctedTimesSorted.length === 0) return <tr></tr>
    let places = 1;
    correctedTimesSorted = correctedTimesSorted.map((elem) => {
        return { ...elem, place: elem.correctedTime ? places++ : null }
    })
    people1.forEach((element, index) => {
        let arr = correctedTimesSorted.filter(elem => elem.userId === element.helm.userId)
        //if (arr.length === 0) return <tr></tr>
        let correctedTime = arr[0].correctedTime
        RaceRows.push({ eventId: eventId, key: element.helm.userId, place: arr[0].place, correctedTime: correctedTime, person: element })
    });
    function toLowerCaseHelper(obj) {
        if (obj == null || obj === undefined) return null
        return obj.toLowerCase()
    }
    const comparisons = {

        "Helm Name": (a, b) => toLowerCaseHelper(a.person.helm.helmName) > toLowerCaseHelper(b.person.helm.helmName) ? 1 : -1,
        "Boat Class": (a, b) => toLowerCaseHelper(a.person.helm.boatName) > toLowerCaseHelper(b.person.helm.boatName) ? 1 : -1,
        "Sail Number": (a, b) => toLowerCaseHelper(a.person.helm.boatNumber) > toLowerCaseHelper(b.person.helm.boatNumber) ? 1 : -1,
        "Place": (a, b) => (a.place === null) - (b.place === null) || +(a.place > b.place) || -(a.place < b.place),
        "PY": (a, b) => (a.person.helm.pY === null) - (b.person.helm.pY === null) || +(a.person.helm.pY > b.person.helm.pY) || -(a.person.helm.pY < b.person.helm.pY),
        "Corrected Time": (a, b) => (a.correctedTime === null) - (b.correctedTime === null) ||
            +(a.correctedTime > b.correctedTime) || -(a.correctedTime < b.correctedTime),

    }

    const sorted = RaceRows.sort(data.orderBy.type == null ? (a, b) => true : comparisons[data.orderBy.type])

    let items = (data.orderBy.reverse ? sorted.reverse() : sorted)
    if (oldData !== []) {
        items.forEach((elem, newIndex) => oldData
            .forEach((item, oldIndex) => item.person.helm.helmName === elem.person.helm.helmName && newIndex !== oldIndex ? newIndex > oldIndex ? items[newIndex].change = "down" : items[newIndex].change = "up" : undefined)
        )
    }

    oldData = items
    let lastPlace = 0
    items.forEach(elem => elem.place > lastPlace ? lastPlace = elem.place : null)
    let maxCorrectedTime = 0
    let minCorrectedTime = 0

    try {
        maxCorrectedTime = items.find(elem => elem.place === lastPlace).correctedTime

        minCorrectedTime = items.find(elem => elem.place === 1).correctedTime
    }
    catch {
        maxCorrectedTime = 0
        minCorrectedTime = 0
    }

    let correctedTimeData = { maxCorrectedTime: maxCorrectedTime, minCorrectedTime: minCorrectedTime }

    let rows = items.map(elem => <RaceRow correctedTimeData={correctedTimeData}
        viewOnly={viewOnly} eventId={elem.eventId} key={elem.key} place={elem.place}
        maxLaps={viewOnly ? undefined : maxLaps} change={elem.change} correctedTime={elem.correctedTime}
        person={elem.person} />)
    console.log(rows.length)
    if (rows.length < 3) {
        for (let index = 0; index <= 4 - rows.length; index++) {
            let row = []
            for (let i = 0; i < 6; i++) {

                // forgive me...
                row.push(<td key={i}><div style={{ "display": "inline-block" }}  ></div></td>)

            }
            row = <Tr key={index}>{row}</Tr>
            rows.push(row)

        }
    }
    return <>{rows}</>

}