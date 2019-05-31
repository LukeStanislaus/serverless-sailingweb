import React from 'react'
import RaceCell from './raceCell'
import LapButton from './lapButton'
import gql from 'graphql-tag'
import {Query} from 'react-apollo'

const correctedTimeQuery=gql`
query correctedTimes {
correctedTimes @client {
    userId
    correctedTime
}
}
`
export default (props) => {
let raceCells = []
    if(props.maxLaps > props.person.laps.length){
        const extra = props.maxLaps - props.person.laps.length
for (let index = 0; index < extra; index++) {
    raceCells.push(<RaceCell key={index}/>)
    
}
    }
    props.person.laps.sort((a, b)=> a.lapTime - b.lapTime).reverse()
raceCells.push(props.person.laps.map(element => 
    <RaceCell key={element.lapId}lap={element}/>
));

return <>
<tr>
    <td key={"helmName"}>{props.person.helm.helmName}</td>
    <td key={"boatName"}>{props.person.helm.boatName}</td>
    <td key={"boatNumber"}>{props.person.helm.boatNumber}</td>
    <td key={"lap"}><LapButton eventId={props.eventId} userId={props.person.helm.userId}/></td>
    <td key={"place"}>Place</td>
    <Query query={correctedTimeQuery} >{({data, loading, error})=>{
if (loading) return <td/>
if(error) return <td>{error.toString()}</td>
console.log(data);
console.log(error);
    return <td key={"correctedTime"}>Corrected Time</td>}}
    </Query>
    {raceCells}</tr>
</>}