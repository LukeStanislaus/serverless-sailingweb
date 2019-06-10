import React from 'react'
import {loader} from 'graphql.macro'
import {AwesomeButton} from 'react-awesome-button'
import { Mutation } from 'react-apollo'
const NEW_LAP = loader('../graphqlQueries/NEW_LAP.graphql')


const GET_LAPS_OF_RACE = loader('../graphqlQueries/GET_LAPS_OF_RACE.graphql')
export default (props) => {

    const newLapInput = {
        input: {
            eventId: props.eventId,
            userId: props.userId,
            lapTime: (new Date()).getTime()
        }
    }
    const getLapsOfRaceInput = {
        input:
        {
            eventId:
                props.eventId
        }

    }
    return <Mutation mutation={NEW_LAP} 
    update={
        (cache, {data: lap})=> {
            const {getLapsOfRace} = cache.readQuery({query: GET_LAPS_OF_RACE, variables: getLapsOfRaceInput})
lap.createLap = {...(lap.createLap), __typename: "Lap"}
const newLaps = getLapsOfRace.concat(lap.createLap)
console.log(JSON.stringify(newLaps));
            cache.writeQuery({
                query: GET_LAPS_OF_RACE,
                data: {getLapsOfRace: newLaps},
                variables: getLapsOfRaceInput
            })
        }
    }

    variables={newLapInput}>{(newLap, {data, loading, error})=> 
    <AwesomeButton onPress={newLap}>Lap</AwesomeButton>}
    </Mutation>
}