import React from 'react'
import RaceSelector from '../raceSelector'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'
import RaceManager from './raceManager'
import {LinkContainer} from 'react-router-bootstrap'
const SELECTED_RACE = loader('../graphqlQueries/SELECTED_RACE.graphql')

export default () => {

    const { loading, data, error } = useQuery(SELECTED_RACE)
    if (error) throw error
    if (loading) return "Loading..."
    return (<> <h1>Manage a race</h1> <RaceSelector includeCreateRace />
    {data.selectedRace !== null &&
        <RaceManager selectedRace={data.selectedRace} />}<LinkContainer to="/ManageData"><>Manage Data</></LinkContainer></>)
}