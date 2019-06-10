import React, { useState } from 'react'
import { AwesomeButton } from 'react-awesome-button'
import { Mutation } from 'react-apollo'
import { loader } from 'graphql.macro'
const REMOVE_FROM_RACE = loader('../graphqlQueries/REMOVE_FROM_RACE.graphql')
const SPECIFIC_EVENT = loader('../graphqlQueries/SPECIFIC_EVENT.graphql')

export default ({ helm, eventId }) => {
    const removeFromRaceInput = {
        input: {
            RemoveFromRaceData: {
                eventId: eventId,
                userId: helm.userId
            }
        }
    }
    const [editHelm, setEditHelm] = useState(false)
    return <Mutation
        update={(cache, { data: { removeFromRace: { RemoveFromRaceData: person } } }) => {
            const specificEventInputVariables = {
                input: {
                    eventData: {
                        eventId: eventId
                    }
                }
            }
            let helmsInRace = cache.readQuery({ query: SPECIFIC_EVENT, variables: specificEventInputVariables })

            helmsInRace = helmsInRace.specificEvent.filter(elem => elem.userId !== person.userId)
            console.log(helmsInRace)
            cache.writeQuery({ query: SPECIFIC_EVENT, variables: specificEventInputVariables, data: { specificEvent: helmsInRace } })
        }}
        mutation={REMOVE_FROM_RACE} variables={removeFromRaceInput} >{(removeFromRace, { loading, data, error }) =>
            <td onClick={() => setEditHelm(!editHelm)}>{helm.helmName}
                {editHelm && <AwesomeButton onPress={() => removeFromRace()} >Remove from race</AwesomeButton>}
            </td>}</Mutation>
}