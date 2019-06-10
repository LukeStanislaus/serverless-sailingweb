import React from 'react'
import RaceSelector from '../raceSelector'
import {loader} from 'graphql.macro'
import {Query} from 'react-apollo'
import RaceManager from './raceManager'
const SELECTED_RACE = loader('../graphqlQueries/SELECTED_RACE.graphql')

export default () => <>

<Query query={SELECTED_RACE}>
{({ loading, error, data, }) => {
                if (loading) return "Loading..."
                if (data.selectedRace ==null) return <><h1>Manage a race</h1><RaceSelector/></>
                return (<> <h1>Manage a race</h1> <RaceSelector/> <RaceManager selectedRace={data.selectedRace}/> </> )}}
</Query>
    </>


