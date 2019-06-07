import React, { useState, useEffect } from 'react'
import { AwesomeButton } from 'react-awesome-button'
import TimePicker from './timePicker'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

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

const getLapsOfRaceQuery = gql`
query getLapsOfRace($input: GetLapsOfRaceInput!) {
  getLapsOfRace(input: $input) {
    userId
    eventId
    lapTime
    lapId
  }
}
`


export default (props) => {
  if (props.lap === undefined) return <td></td>
  const [editTime, setEditTime] = useState(false)
  const [newTime, setNewTime] = useState(props.lap.lapTime)
  useEffect(() => {
    const lt = props.lap.lapTime
    setNewTime(lt)
  }, [editTime, props.lap.lapTime])
  const setTimeInput = {
    input: {
      LapData: {
        eventId: props.eventId,
        lapId: props.lap.lapId,
        lapTime: newTime == null ? newTime : new Date(newTime).getTime()
      }
    }
  }
  return <><Mutation
    mutation={setTime}
    variables={setTimeInput}
    update={(cache)=>{
      if(setTimeInput.input.LapData.lapTime === null) {
        const inputData = {input: {eventId: props.eventId}}
        const {getLapsOfRace} = cache.readQuery({
          query:getLapsOfRaceQuery,
        variables:inputData
        })
        const removedArray = getLapsOfRace.filter(elem=> elem.lapId !== props.lap.lapId)
        cache.writeQuery({
          query: getLapsOfRaceQuery,
          data: {getLapsOfRace: removedArray},
          variables: inputData
      })
      }

    }}
  >{(mutateTime, { error, loading, data }) =>
    <td key={props.lap.lapId}>{<div onClick={() => setEditTime(!editTime)}>{(new Date(props.lap.lapTime)).toLocaleTimeString()}</div>}
      {editTime && <><TimePicker
        newTime={new Date(newTime)}
        setNewTime={setNewTime} />
        {<AwesomeButton
          onPress={mutateTime}>Update Lap</AwesomeButton>}</>}

    </td>
    }</Mutation></>
}


