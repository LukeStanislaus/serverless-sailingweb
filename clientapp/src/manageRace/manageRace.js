import React from 'react'
import RaceSelector from '../raceSelector'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'
import RaceManager from './raceManager'
import {Link} from '@reach/router'
const SELECTED_RACE = loader('../graphqlQueries/SELECTED_RACE.graphql')

export default () => {

    const { loading, data, error } = useQuery(SELECTED_RACE)
    if (error) throw error
    if (loading) return "Loading..."
    return (<> <h1>Manage a race</h1> <RaceSelector includeCreateRace /><Link to="/ManageData">Manage Data</Link>
    {data.selectedRace !== null &&
        <RaceManager selectedRace={data.selectedRace} />}</>)
}