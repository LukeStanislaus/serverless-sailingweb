import React, { useState, useEffect, useRef } from 'react';
import StartRaceButton from './startRaceButton'
import TimePicker from './timePicker'
/* global ServerDate*/
export default ({ finished = false,startTime, eventId, viewOnly=false }) => {
  let [newTime, setNewTime] = useState(new Date(startTime))
  let [editTime, setEditTime] = useState(false)
  let [time, setTime] = useState(ServerDate.getTime())
  let [localFinished, setLocalFinished] = useState(finished)
  useInterval(() =>{setTime(time + 1000);setTime(ServerDate.getTime())}, 1000)

let Timer = ()=><h2>{toHHMMSS(((time - startTime)/1000).toString())}</h2>
  return !viewOnly?<><div style={{ padding: "2%" }} onClick={() => setEditTime(!editTime)} ><Timer />
  </div>
    {editTime && <><TimePicker setNewTime={setNewTime} newTime={newTime} />
     <input type={"checkbox"} value={finished} onClick={()=>setLocalFinished(!localFinished)}/> Race finished?
      <StartRaceButton shouldEarlyStart={false} finished={localFinished} startTime={newTime == null ? null : newTime.getTime()}
        buttonText={"Update Start Time"} eventId={eventId} /></>}
  </>:(<><Timer/> </>)
}


let toHHMMSS = function (str) {
  let negative = false
  var sec_num = parseInt(str, 10); // don't forget the second param :/
  if(sec_num <0) {sec_num = sec_num*-1
  
  negative = true}
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  let timestring  =hours+':'+minutes+':'+seconds 
  return negative? "-" +timestring: timestring;
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