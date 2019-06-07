import React, { useState } from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { AwesomeButton } from 'react-awesome-button'
import { FormControl } from 'react-bootstrap'
import Autocomplete from 'react-autocomplete'

const newPerson = gql`
mutation newPerson($input:NewPersonInput!) {
  newPerson(input:$input){
    newPerson{
      userId
      name
      boatName
      boatNumber
      pY
    }
  }
}
`

export default () => {
  const [name, setName] = useState("")
  const [boatName, setBoatName] = useState("")
  const [boatNumber, setBoatNumber] = useState("")
  const [pY, setPY] = useState(1000)
  const newPersonInput = {
    input: {
      newPersonData: {
        name: name,
        boatName: boatName,
        boatNumber: boatNumber,
        pY: pY
      }
    }
  }
  return (<>
    <h1>Enter a new person</h1>
    <Query query={gql`query getBoats {
allBoatData{
  boatName
  crew
  pY
}
}`}>{({loading, data, error}) =>{
            if (loading) return 'loading'
            return <>
    <Mutation mutation={newPerson} variables={newPersonInput}>{(newPerson, { loading, error }) => {
      if (error != null) return <div>There was an error.</div>
      if (loading) return <div>Loading</div>
      return <><div>
        Enter helm name:
        <FormControl value={name} onChange={(e) => setName(e.target.value)} type="text" />
      </div>
        <div>
          Enter boat name:
<Autocomplete type={"text"}
inputProps={{className:"form-control"}}
          key={"Boat"}
          shouldItemRender={(item, value) => item.elem.boatName.toLowerCase().indexOf(value.toLowerCase()) > -1}
          getItemValue={(item) => item.label}
          items={data.allBoatData=== undefined?[]:data.allBoatData.map((elem)=> {return{elem:elem, id: elem.boatName, label: elem.boatName, name: elem.boatName}})}
          renderItem={(item, isHighlighted) =>
            <div key={item.elem.boatName} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {item.elem.boatName+" (PY "+item.elem.pY+")"}
            </div>
          }
          value={boatName}
          onChange={(e) => {console.log(e.target.value); setBoatName(e.target.value);}}
          onSelect={(val) => setBoatName(val)}
        />
        </div>
        <div>
          Enter boat number:
<FormControl value={boatNumber} onChange={(e) => setBoatNumber(e.target.value)} type="text" />
        </div>
        <div>
          Enter boat PY:
<FormControl value={pY} onChange={(e) => setPY(parseInt(e.target.value))} type="number" />
        </div><div style={{ paddingTop: "20px" }}>
          <AwesomeButton onPress={newPerson}>Enter new person</AwesomeButton>
        </div>
      </>
    }}</Mutation></>}}</Query>



  </>)
}