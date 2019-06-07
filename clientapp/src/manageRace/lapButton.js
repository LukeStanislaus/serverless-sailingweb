import React from 'react'
import {AwesomeButton} from 'react-awesome-button'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag'

const getLapsOfRaceQuery = gql`
query lapsOfRaceAndSignOn($input: GetLapsOfRaceInput!){
    getLapsOfRace(input:$input){
      userId
      eventId
      lapTime
      lapId
    }
}`

const newLapMutation = gql`
mutation newLap($input: CreateLapInput!) {
  createLap(input: $input) {
    eventId
    userId
    lapTime
    lapId
  }
}

`

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
    return <Mutation mutation={newLapMutation} 
    update={
        (cache, {data: lap})=> {
            const {getLapsOfRace} = cache.readQuery({query: getLapsOfRaceQuery, variables: getLapsOfRaceInput})
lap.createLap = {...(lap.createLap), __typename: "Lap"}
const newLaps = getLapsOfRace.concat(lap.createLap)
console.log(JSON.stringify(newLaps));
            cache.writeQuery({
                query: getLapsOfRaceQuery,
                data: {getLapsOfRace: newLaps},
                variables: getLapsOfRaceInput
            })
        }
    }

    variables={newLapInput}>{(newLap, {data, loading, error})=> 
    <AwesomeButton onPress={newLap}>Lap</AwesomeButton>}
    </Mutation>
}