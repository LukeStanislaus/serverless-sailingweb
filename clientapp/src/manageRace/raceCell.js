import React, {useState, useEffect} from 'react'
import {AwesomeButton} from 'react-awesome-button'
import TimePicker from './timePicker'
import gql from 'graphql-tag'
import {Mutation} from 'react-apollo'

const setTime = gql`
mutation updateLap($input: UpdateLapInput!){
  updateLap(input: $input){
    Lap {
      eventId
      lapTime
      lapId
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

export default (props)  => {
    if (props.lap ==undefined) return <td></td>
    const [editTime, setEditTime] = useState(false)
    const [newTime, setNewTime] = useState(props.lap.lapTime)
    useEffect(()=>{
        setNewTime(props.lap.lapTime)
    },[editTime])
    const setTimeInput = {
        input: {
            LapData: {
                eventId: props.eventId,
                lapId: props.lap.lapId,
                lapTime: newTime == null? newTime: new Date(newTime).getTime()
            }
        }
    }
    return <><Mutation 
    mutation={setTime} 
    variables={setTimeInput} 
    refetchQueries={() => {
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
            },
            raceStartInput: {
                eventId: props.eventId
            }
    
        }
        return [
            {
                query: getLapsOfRaceAndSignOn,
                variables: getLapsOfRaceAndSignOnInput
            }
        ]}} 
    
    >{(mutateTime, {error, loading, data}) => 
<td key={props.lap.lapId}>{<div onClick={()=>setEditTime(!editTime)}>{(new Date(props.lap.lapTime)).toLocaleTimeString()}</div>}
{editTime && <><TimePicker 
newTime={new Date(newTime)} setNewTime={setNewTime}/>{<AwesomeButton onPress={mutateTime}>Update Lap</AwesomeButton>}</>}

</td>
}</Mutation></>}


