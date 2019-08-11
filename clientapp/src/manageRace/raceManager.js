import React from 'react'
import RaceHeader from './raceHeader'
import RaceBody from './raceBody'
import { useQuery } from '@apollo/react-hooks'
import StartRaceButton from './startRaceButton'
import RaceTimer from './raceTimer'
import {loader} from 'graphql.macro'
const GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START = loader('../graphqlQueries/GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START.graphql')


export default (props) => {
    const getLapsOfRaceAndSignOnInput = {
        input:
        {
            eventId:
                props.selectedRace.eventId
        },
        eventInput:
        {
            eventData: {
                eventId: props.selectedRace.eventId
            }
        },
        raceStartInput: {
            eventId: props.selectedRace.eventId
        }

    }
    const { data, loading } = useQuery(GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START,
        {variables: getLapsOfRaceAndSignOnInput})
        if (loading) return <div />;
        let max = 0
        let array = data.specificEvent.map(element => {
            let laps = data.getLapsOfRace.filter(elem => elem.userId === element.userId);
            let person = { helm: element, laps: laps };
            if (laps.length > max) max = laps.length
            return person
        });
        return (<>{data.getRaceStart === null ?
<StartRaceButton shouldEarlyStart={true} buttonText={"Press here to start the race"} startTime={new Date().getTime()} eventId={props.selectedRace.eventId} />:
<RaceTimer eventId={props.selectedRace.eventId} startTime={data.getRaceStart}/>}
            <table style={{ border: "1px solid black" }}><tbody><RaceHeader maxLaps={max} />
                <RaceBody eventId={props.selectedRace.eventId} people={array} maxLaps={max} /></tbody>
            </table></>)

}

