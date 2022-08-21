
import TimePicker from 'react-time-picker'
import React from 'react'

export default ({setNewTime, newTime }) => {
    return <TimePicker maxDetail={"second"} onChange={val=> {
        console.log(val)
        if (val == null) {setNewTime(null); return;}
        if (typeof val !== "string") return
        const date = new Date().setHours(val.split(":")[0]);
        const finalDate = new Date(date).setMinutes(val.split(":")[1])
        const secondsDate = new Date(finalDate).setSeconds(val.split(":")[2])
        setNewTime(new Date(secondsDate))
    
    
    }} value={newTime}/> 
}