import React from 'react'
export default (props) => {
    if (props.lap ==undefined) return <td></td>

return <>
<td key={props.lap.lapId}>{(new Date(props.lap.lapTime)).toLocaleTimeString()}</td>
</>}