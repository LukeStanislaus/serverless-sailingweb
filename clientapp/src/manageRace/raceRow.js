import React from 'react'
import RaceCell from './raceCell'
import LapButton from './lapButton'
import ManageHelm from './manageHelm'
import styled from 'styled-components'
let Tr = styled.tr`

:nth-child(even) {background-color: #f2f2f2;}
:hover {background-color: #dddddd;}
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
    <RaceCell key={element.lapId}lap={element} eventId={props.eventId}/>
));
return <>
<Tr>
    <ManageHelm key={"helmName"} helm={props.person.helm} eventId={props.eventId}></ManageHelm>
    <td key={"boatName"}>{props.person.helm.boatName}</td>
    <td key={"boatNumber"}>{props.person.helm.boatNumber}</td>
    <td key={"lap"}><LapButton eventId={props.eventId} userId={props.person.helm.userId}/></td>
    <td key={"place"}>{props.place}</td>

    <td key={"correctedTime"}>{props.correctedTime == null? "":Math.floor((Math.floor(props.correctedTime/1000)/ props.person.laps.length)*props.maxLaps)}</td>
 
    {raceCells}</Tr>
</>}