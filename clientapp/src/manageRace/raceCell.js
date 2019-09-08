import React, { useState, useEffect } from 'react'
import { AwesomeButton } from 'react-awesome-button'
import TimePicker from './timePicker'
import {loader} from 'graphql.macro'
import { useMutation } from '@apollo/react-hooks'
import styled from "styled-components"
let Td = styled.td`
border: 1px solid #ddd;
padding: 8px;
`
const GET_LAPS_OF_RACE = loader('../graphqlQueries/GET_LAPS_OF_RACE.graphql')
const UPDATE_LAP = loader('../graphqlQueries/UPDATE_LAP.graphql')
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
  const [mutateTime]= useMutation(UPDATE_LAP,
    {variables: setTimeInput, update(cache){
      if(setTimeInput.input.LapData.lapTime === null) {
        const inputData = {input: {eventId: props.eventId}}
        const {getLapsOfRace} = cache.readQuery({
          query:GET_LAPS_OF_RACE,
        variables:inputData
        })
        const removedArray = getLapsOfRace.filter(elem=> elem.lapId !== props.lap.lapId)
        
        cache.writeQuery({
          query: GET_LAPS_OF_RACE,
          data: {getLapsOfRace: removedArray},
          variables: inputData
      })
      }

    }})
    return <Td key={props.lap.lapId}>{<div onClick={() => setEditTime(!editTime)}>{(new Date(props.lap.lapTime)).toLocaleTimeString()}</div>}
      {editTime && <><TimePicker
        newTime={new Date(newTime)}
        setNewTime={setNewTime} />
        {<AwesomeButton
          onPress={mutateTime}>Update Lap</AwesomeButton>}</>}
    </Td>
}


