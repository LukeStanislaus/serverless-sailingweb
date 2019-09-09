import React, { useState } from 'react'
import Select from 'react-select'
import { AwesomeButton } from 'react-awesome-button'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
const ADD_RACE = loader("./graphqlQueries/ADD_RACE.graphql")
const GET_RECENT_EVENTS_AND_SELECTED_RACE = loader("./graphqlQueries/GET_RECENT_EVENTS_AND_SELECTED_RACE.graphql")
const SELECT_RACE = loader("./graphqlQueries/SELECT_RACE.graphql")
const SELECTED_RACE = loader("./graphqlQueries/SELECTED_RACE.graphql")
const timeRounded = Math.round((new Date().getTime() / 100000)) * 100000
const recentEventsInput = {
    input: {
        range: {
            start: timeRounded - 100000000,
            end: (timeRounded + 1000000000)
        }
    }
}




export default ({ includeCreateRace = false }) => {
    let [adHoc, setAdHoc] = useState(false)
    const [raceName, setRaceName] = useState("Ad Hoc Race")
    const { loading, data } = useQuery(GET_RECENT_EVENTS_AND_SELECTED_RACE,
        { variables: recentEventsInput })

    const [selectRaceFunc] = useMutation(SELECT_RACE, {
        refetchQueries() {
            return [
                {
                    query: GET_RECENT_EVENTS_AND_SELECTED_RACE,
                    variables: recentEventsInput
                }
            ]
        }
    })
    let adHocRace = { eventId: "createRace", eventName: "Ad Hoc Race", eventTimeStamp: Date.now() };
    function setRace(val) {
        if (val.eventId === "createRace") {
            setAdHoc(true)
            return
        }
        setAdHoc(false)
        val == null ? selectRaceFunc({ variables: { input: null } }) : selectRaceFunc({ variables: { input: { Event: { ...val, "__typename": "Event" }, "__typename": "Event" } } });
    }

    let onPress = () => {
        addRace({ variables: { input: { event: { eventName: raceName, eventTimeStamp: adHocRace.eventTimeStamp } } } })
    }
    const [addRace] = useMutation(ADD_RACE, {
        update(cache, {data:{createEvent:{event}}}) {
            console.log(event);
            cache.writeQuery({
                query: SELECTED_RACE,
                data: {selectedRace: {...event}}
            })
        },
        refetchQueries() {
            return [
                {
                    query: GET_RECENT_EVENTS_AND_SELECTED_RACE,
                    variables: recentEventsInput
                }
            ]
        }
    })

    return (<>Select a Race:
    {loading || !data ? "Loading" : <Select
            isClearable
            value={data.selectedRace}
            options={includeCreateRace ? [adHocRace, ...data.recentEvents] : data.recentEvents}
            getOptionLabel={elem => {
                return elem.eventName + ", " +
                    new Date(elem.eventTimeStamp).toLocaleTimeString() + ", " +
                    new Date(elem.eventTimeStamp).toDateString()
            }}
            onChange={setRace}
        />}
        {adHoc && <><input type={"text"} onChange={e => setRaceName(e.target.value)} value={raceName} /><AwesomeButton onPress={onPress}>Add Race</AwesomeButton></>}</>)
}
