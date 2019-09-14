import React from 'react'
import RaceCell from './raceCell'
import LapButton from './lapButton'
import ManageHelm from './manageHelm'
import styled from 'styled-components'
let Tr = styled.tr`

:nth-child(even) {background-color: #f2f2f2;}
:hover {background-color: #dddddd;}
`
export default ({eventId, correctedTime, place, maxLaps, person}) => {
let raceCells = []
    if(maxLaps > person.laps.length){
        const extra = maxLaps - person.laps.length
for (let index = 0; index < extra; index++) {
    raceCells.push(<RaceCell key={index}/>)
    
}
    }
    person.laps.sort((a, b)=> a.lapTime - b.lapTime).reverse()
raceCells.push(person.laps.map(element => 
    <RaceCell key={element.lapId}lap={element} eventId={eventId}/>
));
return <>
<Tr>
    <ManageHelm key={"helmName"} helm={person.helm} eventId={eventId}></ManageHelm>
    <td key={"boatName"}>{person.helm.boatName}</td>
    <td key={"boatNumber"}>{person.helm.boatNumber}</td>
    <td key={"lap"}><LapButton eventId={eventId} userId={person.helm.userId}/></td>
    <td key={"place"}>{place}</td>

    <td key={"correctedTime"}>{correctedTime == null? "":correctedTime}</td>
 
    {raceCells}</Tr>
</>}