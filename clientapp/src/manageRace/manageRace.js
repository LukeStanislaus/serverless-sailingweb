import React from 'react'
import RaceSelector from '../raceSelector'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'
import RaceManager from './raceManager'
const SELECTED_RACE = loader('../graphqlQueries/SELECTED_RACE.graphql')

export default () => {

    const { loading, data } = useQuery(SELECTED_RACE)
    if (loading) return "Loading..."
    if (data.selectedRace == null) return <><h1>Manage a race</h1><RaceSelector /></>
    return (<> <h1>Manage a race</h1> <RaceSelector /> <RaceManager selectedRace={data.selectedRace} /> </>)
}


