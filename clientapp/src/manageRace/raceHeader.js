import React, {useState} from 'react'
import {AwesomeButton} from 'react-awesome-button'

export default ({maxLaps}) => {
    let laps = []
    for (let index = maxLaps; index > 0; index--) {
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

function HeaderCell(text){
const [picker, setPicker] =useState(false)

    return <th><div onClick={e=>setPicker(!picker)}>{picker&& <AwesomeButton onPress={console.log("object")}>Order by {text}? </AwesomeButton>}</div></th>
}