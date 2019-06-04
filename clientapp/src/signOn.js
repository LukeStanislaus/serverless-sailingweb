import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import Autocomplete from 'react-autocomplete'
import { AwesomeButton } from 'react-awesome-button'
import "react-awesome-button/dist/styles.css";
import Select from 'react-select'
import SelectRace from './raceSelector'
import {Link} from '@reach/router'


const selectedRace = gql`
query getSelectedRace{
  selectedRace @client{
    eventName
    eventId
    eventTimeStamp
  }
}
`

const getBoats = gql`
query getBoatsOfHelm($input: GetBoatsOfHelmInput!) {
  getBoatsOfHelm(input: $input){
    boatName
    boatNumber
    pY
    name
  }
}
`
const signOn = gql`
mutation SignOn ($input: SignOnInput!){
  signOn(input:$input){
    signOn{
      helmName
    }
  }
}`

const allHelms = gql`
query getAllHelms{
  allHelms{
    name
    userId
    boatName
    boatNumber
    pY
  }

}
`



function SignOn() {
  const [crew, setCrew] = useState("")
  const [name, setName] = useState(null)
  const [boatClass, setBoatClass] = useState(null)
  const [notes, setNotes] = useState("")

  const signOnInput = {
    input: {
      signOn: {
        userId: name == null? null: name.userId,
        helmName: name == null? null: name.name,
        boatName: boatClass == null? null:boatClass.boatName,
        boatNumber: boatClass == null? null:boatClass.boatNumber,
        crew: crew === ""? null:crew,
        pY: boatClass == null? null:boatClass.pY,
        notes: notes===""?null:notes
        
      }
    }
  }
  const boatsOfHelmVariables = {
    input: {
      helmName: name == null? null:name.name
    }
  }
  useEffect(() => {
    setBoatClass("")
  }, [name])
      return (<>
      <h1 style={{paddingBottom: "30px"}}>Sign onto a race</h1>
        <SelectRace AfterSelection={()=><div>done</div>}/>
        Helm Name:
        
        <Query query={allHelms}>            
        {
          ({ loading, error, data }) => {
              if (error) return `Error! ${error.message}`
              if (loading) return <Select/>
              return (

          <Select
          isClearable
          key={"HelmName"}
          options={data.allHelms.filter(onlyUnique)}
          value={name}
          getOptionLabel={elem => elem.name}
          onChange={(val) => { setName(val); }}
        />


              )
            }}</Query>
        <div>
        Boat Class:
        {name!==undefined && name!==null?
          <Query query={getBoats} variables={boatsOfHelmVariables}>
            {({ loading, error, data }) => {
              if (loading) return <Select/>
              if (error) return `Error! ${error.message}`
              return (<Select
              isClearable
                isSearchable = {false} 
                key={"BoatClass"}
                value={boatClass}
                onChange={val => setBoatClass(val)}
                options={data.getBoatsOfHelm}
                onSelect={(val) => setBoatClass(val)}
                getOptionLabel={elem => elem.boatName + ", " +
                elem.boatNumber + ". (PY " + elem.pY + ")"}
              />)
            }}
             </Query> : <Select/> 
              
              }
              
            </div>
        Crew Name:
        <Query query={allHelms}>            
        {
          ({ loading, error, data }) => {
              if (error) return `Error! ${error.message}`
              
          return <Autocomplete 
          key={"CrewName"}
          shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
          getItemValue={(item) => item.label}
          items={data.allHelms=== undefined?[]:data.allHelms.map(elem => { return { label: elem.name, id: elem.name, name: elem.name } }).filter(onlyUnique)}
          renderItem={(item, isHighlighted) =>
            <div key={item.label} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {item.label}
            </div>
          }
          value={crew}
          onChange={(e) => setCrew(e.target.value)}
          onSelect={(val) => setCrew(val)}
        />
          }}</Query>
        Notes
        <input value={notes} onChange={e=>setNotes(e.target.value)} /><div align="center" style={{"paddingTop": "50px"}}>
        <Query query={selectedRace}>
          {({data,loading,error})=> { 
            const queryData = data;
            if (loading ) return "Loading"
            return   <Mutation mutation={signOn}>
          {(signOn, { data, loading, error }) => {
            if (data) return `Success.`
            
            let signOnInputVariables = {}
            if(queryData.selectedRace != null){
            signOnInputVariables ={variables: {input: {signOn:{...signOnInput.input.signOn, eventId: queryData.selectedRace.eventId}}}}

            }
            return (<AwesomeButton 
              disabled={(boatClass === "" || name === "" || queryData.selectedRace === null)} 
              ripple 
              onPress={(e)=>{signOn(signOnInputVariables)}} 
              type="primary" 
              style={{
              "--button-raise-level": "4px",
              "--button-hover-pressure": 3
            }}>Enter Race</AwesomeButton>)


          }}
          </Mutation>}}</Query>
          
        <div><Link className={"navbar-text"} to="/NewPerson">Name not in list? Click here.</Link></div>
          
          </div>
      </>
      )}
    


function onlyUnique(value, index, self) {
  return index === self.findIndex((t) => (
    t.name === value.name
  ))
}
export default SignOn