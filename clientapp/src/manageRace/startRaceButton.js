import gql from 'graphql-tag'
import React, {useState} from 'react'
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
export default ({eventId, buttonText, startTime, shouldEarlyStart}) => {
const [earlyStart, setEarlyStart] = useState(false)
    const startRaceVariables = {
        input: {
            StartRaceData: {
                startTime: shouldEarlyStart ? startTime == null ? null: earlyStart? startTime+ 300000: startTime: startTime,
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
return <>{shouldEarlyStart && <><input type={"checkbox"} checked={earlyStart} onClick={()=> setEarlyStart(!earlyStart)} />Would you like to start the timer 5 minutes early?</>}<AwesomeButton onPress={startRace}>{buttonText}</AwesomeButton></>}}
    </Mutation>
}