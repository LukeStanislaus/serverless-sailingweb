import React, { useState, useEffect, useRef } from 'react';
import StartRaceButton from './startRaceButton'
import TimePicker from './timePicker'
import toHHMMSS from '../toHHMMSS'
/* global ServerDate*/
export default ({ finished = false,startTime, eventId, viewOnly=false }) => {
  let [newTime, setNewTime] = useState(new Date(startTime))
  let [editTime, setEditTime] = useState(false)
  let [time, setTime] = useState(ServerDate.getTime())
  let [localFinished, setLocalFinished] = useState(finished)
  useInterval(() =>{setTime(time + 1000);setTime(ServerDate.getTime())}, 1000)
let Timer = ()=><h2>{toHHMMSS(((time - startTime)/1000))}</h2>
  return !viewOnly ? 
<><input type={"checkbox"} checked={localFinished} onChange={()=>setLocalFinished(!localFinished)}/> Race finished?

        
    {!finished&&<div style={{ padding: "2%" }} onClick={() => setEditTime(!editTime)} ><Timer /></div>
}   <>{editTime &&!finished&& <TimePicker setNewTime={setNewTime} newTime={newTime} />}</>
 <StartRaceButton shouldEarlyStart={false} finished={localFinished} startTime={newTime == null ? null : newTime.getTime()}
        buttonText={"Update"} eventId={eventId} />
</>:(<><Timer/> </>)
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