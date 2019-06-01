import React, { useState, useEffect, useRef } from 'react';
import StartRaceButton from './startRaceButton'
import TimePicker from './timePicker'
export default ({startTime, eventId}) => {
    let [newTime, setNewTime] = useState(new Date(startTime))
    let [editTime, setEditTime] = useState(false)
    let [time, setTime] = useState(new Date().getTime())
    useInterval(()=> setTime(time + 1000), 1000)
    return <><div  onClick={()=>setEditTime(!editTime)} >{secondsToTimeString((time - startTime)/1000)} </div>
    {editTime && <><TimePicker setNewTime={setNewTime} newTime={newTime}/>
    <StartRaceButton shouldEarlyStart={false} startTime={newTime==null?null: newTime.getTime()} 
    buttonText={"Update Start Time"} eventId={eventId}/></>}
    </>
}


function secondsToTimeString(seconds){
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds%3600)/60 )
    let secondss = Math.floor(Math.floor(seconds%60 ))
    return hours + ":" + minutes + ":" + secondss
}

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }