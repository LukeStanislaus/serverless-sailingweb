import React from 'react'
import RaceSelector from '../raceSelector'
import gql from 'graphql-tag'
import {Query} from 'react-apollo'
import RaceManager from './raceManager'

const selectedRace = gql`
query selectedRace {
selectedRace @client{
    eventName
    eventId
    eventTimeStamp
}
}`

export default () => {


    return (<>

<Query query={selectedRace}>
{({ loading, error, data, }) => {
                if (loading) return "Loading..."
                if (data.selectedRace ==null) return <>First select the race<RaceSelector/></>
                return (<>  <RaceSelector/> <RaceManager selectedRace={data.selectedRace}/> </> )}}
</Query>
    </>)
}

