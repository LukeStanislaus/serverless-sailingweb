import React, { useState } from 'react'
import { AwesomeButton } from 'react-awesome-button'
import { useMutation } from '@apollo/react-hooks'
//import 'react-awesome-button/dist/themes/theme-red.css';
import {loader} from 'graphql.macro'
const UPDATE_RACE = loader('../graphqlQueries/UPDATE_RACE.graphql')
const GET_RACE_START = loader('../graphqlQueries/GET_RACE_START.graphql')

export default ({ eventId, buttonText, startTime, shouldEarlyStart, finished=false }) => {
    const [earlyStart, setEarlyStart] = useState(false)
    const updateRaceVariables = {
        input: {
            UpdateRaceInputData: {
                startTime: shouldEarlyStart ? startTime == null ? null : earlyStart ? startTime + 300000 : startTime : startTime,
                eventId: eventId,
                finished: finished
            }
        }
    }

    const [updateRace] = useMutation(UPDATE_RACE, {variables: updateRaceVariables, 
        update(cache){
        cache.writeQuery({
            query: GET_RACE_START,
            variables: {input:{ eventId: eventId}},
            data:{getRaceStart: updateRaceVariables.input.UpdateRaceInputData.startTime} 
        })
    }})
    return <>{shouldEarlyStart && <>
        <input
            type={"checkbox"}
            checked={earlyStart}
            onChange={() => setEarlyStart(!earlyStart)} />
        Would you like to start the timer 5 minutes early?
</>}<AwesomeButton style={{"zIndex":0}}
            onPress={updateRace}>
            {buttonText}
        </AwesomeButton></>
}