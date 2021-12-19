import React from 'react'
import RaceSelector from './raceSelector'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'
import RaceManager from './manageRace/raceManager'
import ViewGraph from './viewGraph'
const SELECTED_RACE = loader('./graphqlQueries/SELECTED_RACE.graphql')


export default () => {
    const { loading, data, error } = useQuery(SELECTED_RACE)
    if (error) return error
    if (loading) return "Loading..."
    return <> <h1>View a race</h1> <RaceSelector />{data.selectedRace !== null &&  <RaceManager  selectedRace={data.selectedRace} viewOnly={true} /> }
    {data?<ViewGraph data={data} />:null}</>
}

