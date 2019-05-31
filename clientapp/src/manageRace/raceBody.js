import React from 'react'
import RaceRow from './raceRow'
import gql from 'graphql-tag'
import {Query} from 'react-apollo'



export default (props) => 
{
    let RaceRows = []
props.people.forEach((element, index) => {
    RaceRows.push(<RaceRow eventId={props.eventId} key={index} maxLaps={props.maxLaps} person={element}/>)
});
    return <>

{RaceRows}
</>}

