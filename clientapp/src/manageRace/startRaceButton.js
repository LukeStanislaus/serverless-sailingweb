import gql from 'graphql-tag'
import React, { useState } from 'react'
import { AwesomeButton } from 'react-awesome-button'
import { useMutation } from '@apollo/react-hooks'
import {loader} from 'graphql.macro'
const START_RACE = loader('../graphqlQueries/START_RACE.graphql')

export default ({ eventId, buttonText, startTime, shouldEarlyStart }) => {
    const [earlyStart, setEarlyStart] = useState(false)
    const startRaceVariables = {
        input: {
            StartRaceData: {
                startTime: shouldEarlyStart ? startTime == null ? null : earlyStart ? startTime + 300000 : startTime : startTime,
                eventId: eventId
            }
        }
    }

    const [startRace] = useMutation(START_RACE, {variables: startRaceVariables, 
        update(cache){
        cache.writeQuery({
            query: gql`
            query getRaceStart($input:GetRaceStartInput!){
              getRaceStart(input: $input)
            }`,
            variables: {input:{ eventId: eventId}},
            data:{getRaceStart: startRaceVariables.input.StartRaceData.startTime} 
        })
    }})
    return <>{shouldEarlyStart && <>
        <input
            type={"checkbox"}
            checked={earlyStart}
            onChange={() => setEarlyStart(!earlyStart)} />
        Would you like to start the timer 5 minutes early?
</>}<AwesomeButton
            onPress={startRace}>
            {buttonText}
        </AwesomeButton></>
}