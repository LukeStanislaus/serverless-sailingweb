import React from 'react'
import Createable from 'react-select/creatable'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
const ADD_RACE = loader("./graphqlQueries/ADD_RACE.graphql")
const GET_RECENT_EVENTS_AND_SELECTED_RACE = loader("./graphqlQueries/GET_RECENT_EVENTS_AND_SELECTED_RACE.graphql")
const SELECT_RACE = loader("./graphqlQueries/SELECT_RACE.graphql")
const SELECTED_RACE = loader("./graphqlQueries/SELECTED_RACE.graphql")
const REMOVE_EVENT = loader("./graphqlQueries/REMOVE_EVENT.graphql")
const timeRounded = Math.round((new Date().getTime() / 100000)) * 100000
const recentEventsInput = {
    input: {
        range: {
            start: "0",
            end: (timeRounded + 10000000000).toString()
        }
    }
}



export default ({ includeCreateRace = false }) => {
    const { loading, data, error } = useQuery(GET_RECENT_EVENTS_AND_SELECTED_RACE,
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
    function setRace(val) {

        val == null ? selectRaceFunc({ variables: { input: null } }) : selectRaceFunc({ variables: { input: { Event: { ...val, "__typename": "Event" }, "__typename": "Event" } } });
    }

const [removeEvent] = useMutation(REMOVE_EVENT, {
    update(cache) {
        cache.writeQuery({
            query: SELECTED_RACE,
            data: {selectedRace: null}
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
    const [addRace] = useMutation(ADD_RACE, {
        update(cache, {data:{createEvent:{event}}}) {
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
    
if (error) return <div>{error.message}</div>
if (loading)  return <Createable isLoading />

let sortedRecentEvents= data.recentEvents?data.recentEvents.sort((a,b)=>{ return -(parseInt(a.eventTimeStamp)-
    parseInt(b.eventTimeStamp))}): null
    
    return (<>Select a Race:
    {<Createable
    autoFocus
    isLoading={loading || !data}
            isClearable
            value={data.selectedRace}
            options={sortedRecentEvents}
            formatOptionLabel={elem => {
                if (elem.__isNew__)return elem.label+", " + new Date(Date.now()).toLocaleTimeString()+ ", " + new Date(Date.now()).toDateString()
                return <div>{elem.eventName + ", " +
                    new Date(parseInt(elem.eventTimeStamp)).toLocaleTimeString() + ", " +
            new Date(parseInt(elem.eventTimeStamp)).toDateString() + (elem.finished?" - FINISHED":"")}
            {includeCreateRace && <button style={{"float":"right"}} onClick={e=>{removeEvent({variables:{input:{event:{eventId:elem.eventId}}}})}} children={"Remove Race"}type={"button"}/>}
            </div>}
            }
            onCreateOption={(elem)=> 
                 {addRace({ variables: { input: { event: { eventName: elem, eventTimeStamp: Date.now().toString() } } } })
                }
            }
            isValidNewOption={(elem)=> elem!==""&&includeCreateRace}
            onChange={setRace}
        />}
        </>)
}
