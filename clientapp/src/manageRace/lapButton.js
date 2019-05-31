import React from 'react'
import {AwesomeButton} from 'react-awesome-button'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag'

const getLapsOfRaceAndSignOn = gql`
query lapsOfRaceAndSignOn($input: GetLapsOfRaceInput!, $eventInput: SpecificEventInput!){
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
    const getLapsOfRaceAndSignOnInput = {
        input:
        {
            eventId:
                props.eventId
        },
        eventInput:
        {
            eventData: {
                eventId: props.eventId
            }
        }

    }
    return <Mutation mutation={newLapMutation} 
//     update={
//         (cache, {data: lap})=> {
//             const {getLapsOfRace, specificEvent} = cache.readQuery({query: getLapsOfRaceAndSignOn, variables: getLapsOfRaceAndSignOnInput})
// console.log(lap);
//             cache.writeData({
//                 //query: getLapsOfRaceAndSignOn,
//                 data: {getLapsOfRace: getLapsOfRace.push(lap.createLap), specificEvent}
//             })
//         }
//     }
    refetchQueries={()=>{
       return [{
           query: getLapsOfRaceAndSignOn,
           variables: getLapsOfRaceAndSignOnInput
       }
       ]
    }}
    variables={newLapInput}>{(newLap, {data, loading, error})=> 
    <AwesomeButton onPress={newLap}>Lap</AwesomeButton>}
    </Mutation>
}