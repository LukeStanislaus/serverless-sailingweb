import React from 'react'
import RaceHeader from './raceHeader'
import RaceBody from './raceBody'
import { useQuery, useMutation} from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
import StartRaceButton from './startRaceButton'
import RaceTimer from './raceTimer'
import { AwesomeButton } from 'react-awesome-button'
const GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START = loader('../graphqlQueries/GET_LAPS_OF_RACE_SPECIFIC_EVENT_AND_GET_RACE_START.graphql')
const SELECT_ORDER_BY = loader('../graphqlQueries/SELECT_ORDER_BY.graphql')
const ORDER_BY = loader("../graphqlQueries/ORDER_BY.graphql")

export default ({selectedRace, viewOnly=false, hook= null}) => {
    const getLapsOfRaceAndSignOnInput = {
        input:
        {
            eventId:
                selectedRace.eventId
        },
        eventInput:
        {
            eventData: {
                eventId:  selectedRace.eventId
            }
        },
        raceStartInput: {
            eventId:  selectedRace.eventId
        }




    }
    const [selectOrderBy] = useMutation(SELECT_ORDER_BY, {
        refetchQueries: () => {
            return [
                {
                    query: ORDER_BY
                }
            ]
        }
    })
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
        !viewOnly&&<StartRaceButton shouldEarlyStart={true} buttonText={"Press here to start the race"} startTime={new Date().getTime()} eventId={selectedRace.eventId} /> :
        <RaceTimer eventId={selectedRace.eventId} startTime={data.getRaceStart} viewOnly={viewOnly}/>}
        <table style={{ "display": "block", "overflowX": "auto", "whiteSpace": "nowrap" }}><tbody><RaceHeader maxLaps={viewOnly?undefined:max} viewOnly={viewOnly}/>
            <RaceBody hook={hook} eventId={selectedRace.eventId} people={array} maxLaps={max} viewOnly={viewOnly}/>
        </tbody>
        </table>
        <AwesomeButton style={{ "zIndex": 0 }} onPress={() => selectOrderBy({ variables: { input: { SelectOrderByInput: { type: null } } } })}>Clear sort</AwesomeButton></>)

}

