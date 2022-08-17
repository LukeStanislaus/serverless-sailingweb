import React, {useState, useEffect} from 'react'
import { loader } from 'graphql.macro'
import { AwesomeButton } from 'react-awesome-button'
import { useMutation } from '@apollo/react-hooks'
const NEW_LAP = loader('../graphqlQueries/NEW_LAP.graphql')

/* global ServerDate*/
const GET_LAPS_OF_RACE = loader('../graphqlQueries/GET_LAPS_OF_RACE.graphql')
export default ({eventId, lapsCount, userId}) => {
    const [colour, setColour] = useState("primary")
    useEffect(()=>{
        if(colour!=="primary") setTimeout(()=>setColour("primary"), 1500);
    }, [colour])
    const getLapsOfRaceInput = {
        input:
        {
            eventId:
                eventId
        }

    }
    const [newLap] = useMutation(NEW_LAP, { update(cache, { data: lap }) {
            const getLapsOfRace = cache.readQuery({ query: GET_LAPS_OF_RACE, variables: getLapsOfRaceInput })
            console.log(getLapsOfRace);
            lap.createLap = { ...(lap.createLap), __typename: "Lap" }
            const newLaps = getLapsOfRace.getLapsOfRace.concat(lap.createLap)
            cache.writeQuery({
                query: GET_LAPS_OF_RACE,
                data: { getLapsOfRace: newLaps },
                variables: getLapsOfRaceInput
            })
        }
    })
    return <AwesomeButton type={colour} style={{ "zIndex": 0 }} onPress={() =>{
        newLap({variables:{
        input: {
            eventId: eventId,
            userId: userId,
            lapTime: ServerDate.getTime().toString()
        }
    }});
    setColour("Secondary");

    }}>Lap ({lapsCount})</AwesomeButton>
}