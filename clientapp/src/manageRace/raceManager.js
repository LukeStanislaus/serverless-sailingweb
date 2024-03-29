import React from 'react'
import RaceHeader from './raceHeader'
import RaceBody from './raceBody'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
import StartRaceButton from './startRaceButton'
import RaceTimer from './raceTimer'
import { AwesomeButton } from 'react-awesome-button'
const GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START = loader('../graphqlQueries/GET_LAPS_OF_RACE_SPECIFIC_EVENT_GET_RACE_START_AND_ORDER_BY.graphql')
const SELECT_ORDER_BY = loader('../graphqlQueries/SELECT_ORDER_BY.graphql')
let RaceManager = ({ selectedRace, viewOnly = false }) => {
    const getLapsOfRaceAndSignOnInput = {
        input:
        {
            eventId:
                selectedRace.eventId
        },
        eventInput:
        {
            eventData: {
                eventId: selectedRace.eventId
            }
        },
        raceStartInput: {
            eventId: selectedRace.eventId
        }




    }
    const [selectOrderBy] = useMutation(SELECT_ORDER_BY)

    const { data, loading, error } = useQuery(GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START,
        { variables: getLapsOfRaceAndSignOnInput })
    if (loading) return <div />;
    if (error) return <div>{JSON.stringify(error)}</div>
    let max = 0
    let array = data.specificEvent.map(element => {
        let laps = data.getLapsOfRace.filter(elem => elem.userId === element.userId);
        let person = { helm: element, laps: laps };
        if (laps.length > max) max = laps.length
        return person
    });
    return (<>{data.getRaceStart === null ?
        !viewOnly && <StartRaceButton finshed={selectedRace.finished} shouldEarlyStart={true} buttonText={"Press here to start the race"} startTime={new Date().getTime()} eventId={selectedRace.eventId} /> :
        <> <RaceTimer finished={selectedRace.finished} eventId={selectedRace.eventId} startTime={parseInt(data.getRaceStart)} viewOnly={viewOnly} /></>}
        <table style={{ "display": "block", "overflowX": "auto", "whiteSpace": "nowrap", "top":"300" }}><tbody><RaceHeader maxLaps={viewOnly ? undefined : max} viewOnly={viewOnly} />
            <RaceBody eventId={selectedRace.eventId} people={array} maxLaps={max} viewOnly={viewOnly} />
        </tbody>
        </table>
        <AwesomeButton style={{ "zIndex": 0 }} onPress={() => selectOrderBy({ variables: { input: { SelectOrderByInput: { type: null } } } })}>Clear sort</AwesomeButton></>)

}

export default RaceManager