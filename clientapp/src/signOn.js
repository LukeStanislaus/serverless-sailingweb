import React, {useState} from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Autocomplete from 'react-autocomplete'
import Select from 'react-select'
const allHelms = gql`
query getAllHelmsAndRecentEvents($input: RecentEventsInput!){
  allHelms{
    name
    userId
    boatName
    boatNumber
    pY
  }
  recentEvents(input: $input){
    eventId
    eventName
    eventTimeStamp
  }
}
`

const getBoats = gql`
`

function SignOn(){
const [name, setName] = useState("")
const [calendar, setCalendar] = useState("")
const [boatClass, setBoatClass] = useState("")
const timeRounded = Math.round((new Date().getTime()/100000))*100000
const allHelmsInput = {"input":{
  "range": {
    "start" : timeRounded,
    "end": (timeRounded+1000000000)
  }
}}
return <Query query={allHelms} variables={allHelmsInput}>
    {({loading, error, data})=>{
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`
        
        return (<>
        Select Race:
                  <Autocomplete 
            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
            getItemValue={(item) => item.label}
            items={data.recentEvents.map(elem => {return {label: elem.eventName + ", " + 
            new Date(elem.eventTimeStamp).toLocaleTimeString() + ", " + 
            new Date(elem.eventTimeStamp).toDateString(), id: elem.eventName}})}
            renderItem={(item, isHighlighted) =>
              <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                {item.label}
              </div>
            }
            value={calendar}
            onChange={(e) => setCalendar(e.target.value)}
            onSelect={(val) => setCalendar(val)}
          />
        Helm Name: 
          <Autocomplete 
            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
            getItemValue={(item) => item.label}
            items={data.allHelms.map(elem => {return {label: elem.name, id: elem.name}})}
            renderItem={(item, isHighlighted) =>
              <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                {item.label}
              </div>
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            onSelect={(val) => setName(val)}
          />
          Boat Class:<Query query={getBoats}>
          <Autocomplete 
            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
            getItemValue={(item) => item.label}
            items={data.allHelms.map(elem => {return {label: elem.name, id: elem.name}})}
            renderItem={(item, isHighlighted) =>
              <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                {item.label}
              </div>
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            onSelect={(val) => setName(val)}
          />
</Query>
          
              
</>
            )
        }}
</Query>
}
export default SignOn