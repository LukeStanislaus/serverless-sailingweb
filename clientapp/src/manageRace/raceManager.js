import React, {useState} from 'react'
import RaceHeader from './raceHeader'
import RaceBody from './raceBody'
import { useQuery } from '@apollo/react-hooks'
import StartRaceButton from './startRaceButton'
import RaceTimer from './raceTimer'
import {loader} from 'graphql.macro'
import {AwesomeButton} from 'react-awesome-button'
const GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START = loader('../graphqlQueries/GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START.graphql')


export default (props) => {
    const [orderBy, setOrderBy] = useState((a,b)=>true)
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
    const { data, loading, error } = useQuery(GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START,
        {variables: getLapsOfRaceAndSignOnInput})
        if (loading) return <div />;
        if(error) return <div>{JSON.stringify(error)}</div>
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
            <table style={{ border: "1px solid black" }}><tbody><RaceHeader maxLaps={max} setOrderBy={setOrderBy} />
                <RaceBody eventId={props.selectedRace.eventId} people={array} maxLaps={max} compareFn={orderBy} /></tbody>
            </table>
            {/*<AwesomeButton onPress={setOrderBy((a,b)=>true)}>Remove sorting</AwesomeButton>*/}</>)

}

