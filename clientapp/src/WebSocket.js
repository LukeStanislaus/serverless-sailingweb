import { useApolloClient } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
const GET_LAPS_OF_RACE = loader('./graphqlQueries/GET_LAPS_OF_RACE.graphql')
const SPECIFIC_EVENT = loader('./graphqlQueries/SPECIFIC_EVENT.graphql')
const GET_RACE_START = loader('./graphqlQueries/GET_RACE_START.graphql')

export default () => {
    let client = useApolloClient()
    let ws = new WebSocket("wss://705dyjpxp6.execute-api.us-east-1.amazonaws.com/dev")
    ws.onopen = () => {
        console.info("Websocket connected");
        ws.onmessage = (event) => {
            try {
                console.log("Data recieved")
                let data = JSON.parse(event.data);
                console.log(data)
                switch (data.type) {
                    case "newLap": {
                        const getLapsOfRaceInput = {
                            input:
                            {
                                eventId:
                                    data.payload.eventId
                            }

                        }
                        let { getLapsOfRace } = client.readQuery({ query: GET_LAPS_OF_RACE, variables: getLapsOfRaceInput })
                        if (getLapsOfRace.every(elem => elem.lapId !== data.payload.lapId)) {

                            client.writeQuery({
                                query: GET_LAPS_OF_RACE,
                                data: { getLapsOfRace: getLapsOfRace.concat({ ...(data.payload), __typename: "Lap" }) },
                                variables: getLapsOfRaceInput
                            })
                        }

                    }
                        break;
                    case "updateLap": {
                        const inputData = { input: { eventId: data.payload.eventId } }
                        let { getLapsOfRace } = client.readQuery({
                            query: GET_LAPS_OF_RACE,
                            variables: inputData
                        })
                        let removedArray = getLapsOfRace.filter(elem => elem.lapId !== data.payload.lapId)
                        if (data.payload.lapTime == null) {
                        }
                        else {
                            const lap = { ...(data.payload), __typename: "Lap" }
                            removedArray = removedArray.concat(lap)
                        }
                        client.writeQuery({
                            query: GET_LAPS_OF_RACE,
                            data: { getLapsOfRace: removedArray },
                            variables: inputData
                        })
                    }
                        break;
                    case "signOn": {
                        const specificEventInputVariables = {
                            input: {
                                eventData: {
                                    eventId: data.payload.eventId
                                }
                            }
                        }
                        let { specificEvent } = client.readQuery({ query: SPECIFIC_EVENT, variables: specificEventInputVariables })
                        if (specificEvent.every(elem => elem.userId !== data.payload.userId)) {
                            client.writeQuery({ query: SPECIFIC_EVENT, variables: specificEventInputVariables, data: {specificEvent:specificEvent.concat({ "__typename": "SignOn", ...data.payload })} })
                        }
                        break;
                    }
                    case "removePerson": {
                        const specificEventInputVariables = {
                            input: {
                                eventData: {
                                    eventId: data.payload.eventId
                                }
                            }
                        }
                        let helmsInRace = client.readQuery({ query: SPECIFIC_EVENT, variables: specificEventInputVariables })

                        helmsInRace = helmsInRace.specificEvent.filter(elem => elem.userId !== data.payload.userId)
                        client.writeQuery({ query: SPECIFIC_EVENT, variables: specificEventInputVariables, data: { specificEvent: helmsInRace } })
                        break;
                    }
                    case "updateRace": {
                        console.log(data.payload)
                        client.writeQuery({
                            query: GET_RACE_START,
                            variables: { input:{ eventId: data.payload.eventId}},
                            data:{getRaceStart: data.payload.startTime} 
                        })
                        break;
                    }
                    default: {

                    }
                }
            }
            catch (e) {
                if (e.name === "Invariant Violation") {  }
                else {
                    throw e;
                }
            }
        }
    }
    return null
}
