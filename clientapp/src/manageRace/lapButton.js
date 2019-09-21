import React from 'react'
import {loader} from 'graphql.macro'
import {AwesomeButton} from 'react-awesome-button'
import { useMutation } from '@apollo/react-hooks'
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
    const [newLap] = useMutation(NEW_LAP,{
        variables: newLapInput, update(cache, {data: lap}){
            const {getLapsOfRace} = cache.readQuery({query: GET_LAPS_OF_RACE, variables: getLapsOfRaceInput})
lap.createLap = {...(lap.createLap), __typename: "Lap"}
const newLaps = getLapsOfRace.concat(lap.createLap)
            cache.writeQuery({
                query: GET_LAPS_OF_RACE,
                data: {getLapsOfRace: newLaps},
                variables: getLapsOfRaceInput
            })
        }
    })
    return <AwesomeButton style={{ "zIndex": 0 }} onPress={newLap}>Lap</AwesomeButton>
}