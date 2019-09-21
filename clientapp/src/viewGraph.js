import React from 'react'
import { Line } from 'react-chartjs-2'

export default ({data:{correctedTimeData:{maxCorrectedTime, minCorrectedTime}, items, raceStart}}) => {
    let firstLapTime = 0
    items.forEach(elem=>elem)
    let names = items.map(elem=> elem.person.helm.helmName)
    let lineData = {labels:[maxCorrectedTime, minCorrectedTime],
    datasets:[{}]}
return null /*<Line data={lineData}/>*/}