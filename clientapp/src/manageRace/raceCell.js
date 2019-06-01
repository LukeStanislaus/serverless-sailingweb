import React, {useState} from 'react'
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

export default (props)  => {
    if (props.lap ==undefined) return <td></td>
    const [editTime, setEditTime] = useState(false)
    const [newTime, setNewTime] = useState(props.lap.lapTime)

    const setTimeInput = {
        input: {
            LapData: {
                eventId: props.eventId,
                lapId: props.lap.lapId,
                lapTime: newTime
            }
        }
    }
    console.log(setTimeInput)
    return <><Mutation mutation={setTime} variables={setTimeInput} >{(mutateTime, {error, loading, data}) => 
<td key={props.lap.lapId}>{<div onClick={()=>setEditTime(!editTime)}>{(new Date(props.lap.lapTime)).toLocaleTimeString()}</div>}
{editTime && <><TimePicker 
newTime={new Date(newTime)} setNewTime={setNewTime}/>{data == null ? <AwesomeButton onPress={mutateTime}>Update Lap</AwesomeButton>:"Success"}</>}

</td>
}</Mutation></>}


