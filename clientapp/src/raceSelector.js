import React from 'react'
import gql from 'graphql-tag'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'

const getRecentEventsAndSelectedRace = gql` 
query getRecentEvents($input:RecentEventsInput!) {
 recentEvents(input: $input){
    eventId
    eventName
    eventTimeStamp
}

selectedRace @client{
            eventName
            eventId
            eventTimeStamp
        }
}`
const timeRounded = Math.round((new Date().getTime() / 100000)) * 100000
const recentEventsInput = {
    input: {
        range: {
            start: timeRounded,
            end: (timeRounded + 1000000000)
        }
    }
}

const selectRace = gql`
    mutation selectRace ($input: SelectRaceInput!){
        selectRace(input: $input) @client{
            eventId
        }
    }
`



export default (props) => {
    const { loading, data } = useQuery(getRecentEventsAndSelectedRace,
        { variables: recentEventsInput })
    
    const [selectRaceFunc] = useMutation(selectRace, {
        refetchQueries() {
            return [
                {
                    query: getRecentEventsAndSelectedRace,
                    variables: recentEventsInput
                }
            ]
        }
    })
    return (<>Select a Race:
    { loading || !data? "Loading" : <Select
        isClearable
        value={data.selectedRace}
        options={data.recentEvents}
        getOptionLabel={elem => {
            return elem.eventName + ", " +
                new Date(elem.eventTimeStamp).toLocaleTimeString() + ", " +
                new Date(elem.eventTimeStamp).toDateString()
        }}
        onChange={(val) => { val == null ? selectRaceFunc({ variables: { input: null } }) : selectRaceFunc({ variables: { input: { Event: { ...val, "__typename": "Event" }, "__typename": "Event" } } }); }}
    /> }
    </>)
}
