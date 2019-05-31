import React from 'react'


export default (props) => {
    let laps = []
    for (let index = props.maxLaps; index > 0; index--) {
        laps.push(<th key={index}>{index}</th>)
        
    }
    return <tr>
    <th>Helm Name</th>
    <th>Boat Class</th>
    <th>Sail Number</th>
    <th>Lap</th>
    <th>Place</th>
    <th>Corrected Time</th>
    {laps}

    </tr>}