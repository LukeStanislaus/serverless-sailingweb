import { withApollo } from '@apollo/react-hoc'
import { loader } from 'graphql.macro'
const GET_LAPS_OF_RACE = loader('./graphqlQueries/GET_LAPS_OF_RACE.graphql')
const SPECIFIC_EVENT = loader('./graphqlQueries/SPECIFIC_EVENT.graphql')

let WebSocketItem = ({ client }) => {
    let ws = new WebSocket("wss://c7s4ipb33a.execute-api.us-east-1.amazonaws.com/dev")
    ws.onopen = () => {
        console.info("Websocket connected");
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                console.log(data);
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
                        const lap = { ...(data.payload), __typename: "Lap" }
                        const newLaps = getLapsOfRace.concat(lap)
                        client.writeQuery({
                            query: GET_LAPS_OF_RACE,
                            data: { getLapsOfRace: newLaps },
                            variables: getLapsOfRaceInput
                        })
                    }
                        break;
                    case "updateLap": {
                        const inputData = { input: { eventId: data.payload.eventId } }
                        let { getLapsOfRace } = client.readQuery({
                            query: GET_LAPS_OF_RACE,
                            variables: inputData
                        })
                        const removedArray = getLapsOfRace.filter(elem => elem.lapId !== data.payload.lapId)
                        console.log(removedArray);

                        if (data.payload.lapTime == null) {
                        }
                        else {
                            removedArray.concat({ ...(data.payload), __typename: "Lap" })
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
                        let helmsInRaces = client.readQuery({ query: SPECIFIC_EVENT, variables: specificEventInputVariables })
                        let helmsInSpecificRace = helmsInRaces.specificEvent.concat({ "__typename": "SignOn", ...data.payload })
                        client.writeQuery({ query: SPECIFIC_EVENT, variables: specificEventInputVariables, data: { specificEvent: helmsInSpecificRace } })
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

                        console.log("removed from race")
                        break;
                    }
                    default: {

                    }
                }
            }
            catch (e) {
                if (e.name === "Invariant Violation") console.log("invariant");
                else {
                    throw e;
                }
            }
        }
    }
    return null
}

export default withApollo(WebSocketItem)