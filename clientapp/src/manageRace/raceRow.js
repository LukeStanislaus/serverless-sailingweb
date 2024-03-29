import React from 'react'
import RaceCell from './raceCell'
import LapButton from './lapButton'
import ManageHelm from './manageHelm'
import styled from 'styled-components'
import toHHMMSS from '../toHHMMSS'

let Tr = styled.tr`

:nth-child(even) {background-color: #f2f2f2;}
:hover {background-color: #dddddd;}
`
let RaceRow = ({ eventId, elapsedTime, correctedTime, place, maxLaps, person, viewOnly = false, change, correctedTimeData: { maxCorrectedTime, minCorrectedTime } }) => {
    let raceCells = []
    if (!viewOnly) {
        if (maxLaps > person.laps.length) {
            const extra = maxLaps - person.laps.length
            for (let index = 0; index < extra; index++) {
                raceCells.push(<RaceCell key={index} />)

            }
        }
        person.laps.sort((a, b) => parseInt(a.lapTime) - parseInt(b.lapTime)).reverse()
        raceCells.push(person.laps.map(element =>
            <RaceCell key={element.lapId} lap={element} eventId={eventId} />
        ));
    }
    let award = undefined;
    switch (place) {
        case 1:
            award = "gold";
            break;
        case 2:
            award = "silver";
            break;
        case 3:
            award = "#ff9428";
            break;
        default:
            award = undefined

    }
    let icon = ""
    if (change === "up") {
        icon = " ↑"
    }
    else if (change === "down") {
        icon = " ↓"
    }
    return <>
        <Tr>
            {viewOnly ? <td style={{ backgroundColor: award }} key="helmName">{person.helm.helmName}</td> : <ManageHelm key={"helmName"} helm={person.helm} eventId={eventId}></ManageHelm>}
            {viewOnly ? <td key={"PY"}>{person.helm.pY}</td> : null}
            <td key={"boatName"}>{person.helm.boatName}</td>

            <td key={"boatNumber"}>{person.helm.boatNumber}</td>
            {!viewOnly && <td key={"lap"}><LapButton eventId={eventId} userId={person.helm.userId} lapsCount={person.laps.length} /></td>}
            <td key={"place"}>{place ? place + " " + icon : ""}</td>


            {raceCells}
            <td key={"correctedTime"}><div style={viewOnly ? { width: ((maxCorrectedTime - correctedTime) / 
            (maxCorrectedTime - minCorrectedTime)) * 100 + "%", backgroundColor: "red" } : {}}>{correctedTime == null ? "" :
             toHHMMSS(correctedTime)}</div></td>

                         <td key={"elapsedTime"}><div>{elapsedTime == null ? "" :
             toHHMMSS(elapsedTime)}</div></td>
</Tr>
    </>
}
export default RaceRow