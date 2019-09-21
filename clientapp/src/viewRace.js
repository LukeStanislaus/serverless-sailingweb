import React, { useState, useMemo } from 'react'
import RaceSelector from './raceSelector'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'
import RaceManager from './manageRace/raceManager'
import ViewGraph from './viewGraph'
const SELECTED_RACE = loader('./graphqlQueries/SELECTED_RACE.graphql')


export default () => {
    let [raceData, setRaceData] = useState( null)
    const { loading, data, error } = useQuery(SELECTED_RACE)
    if (error) return error
    if (loading) return "Loading..."
    return <>{useMemo(()=>ViewRaceBuilder(setRaceData, data), [data])}{raceData?<ViewGraph data={raceData} />:null}</>
}

function ViewRaceBuilder(hook, data){

    return (<> <h1>View a race</h1> <RaceSelector />{data.selectedRace !== null && <> <RaceManager hook={hook} selectedRace={data.selectedRace} viewOnly={true} /> </>}</>)

}
