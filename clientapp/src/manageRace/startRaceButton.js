import gql from 'graphql-tag'
import React from 'react'
import {AwesomeButton} from 'react-awesome-button'
import {Mutation} from 'react-apollo'

const startRace = gql`
mutation startRace ($input: StartRaceInput!){
  startRace(input: $input){
    StartRaceData{
    eventId
    startTime
    }
  }
}
`
const getLapsOfRaceAndSignOn = gql`
query lapsOfRaceAndSignOn($input: GetLapsOfRaceInput!, $eventInput: SpecificEventInput!, $raceStartInput:GetRaceStartInput!){
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
  getRaceStart(input: $raceStartInput)
}`
export default ({eventId, buttonText, startTime}) => {

    const startRaceVariables = {
        input: {
            StartRaceData: {
                startTime: startTime,
                eventId: eventId
            }
        }
    }
return <Mutation refetchQueries={() => {
    const getLapsOfRaceAndSignOnInput = {
        input:
        {
            eventId:
                eventId
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
    return [
        {
            query: getLapsOfRaceAndSignOn,
            variables: getLapsOfRaceAndSignOnInput
        }
    ]}} mutation={startRace} variables={startRaceVariables}>{startRace =>{
        return <AwesomeButton onPress={startRace}>{buttonText}</AwesomeButton>}}
    </Mutation>
}