import React, {useState} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import {AwesomeButton} from 'react-awesome-button'
import {FormControl} from 'react-bootstrap'

const newPerson = gql`
mutation newPerson($input:NewPersonInput!) {
  newPerson(input:$input){
    newPerson{
      userId
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
    <Mutation mutation={newPerson} variables={newPersonInput}>{(newPerson, {data,loading,error})=>{
console.log(newPerson)
if(error!=null) return <div>There was an error.</div>
if (loading) return <div>Loading</div>
        return <><div>
        Enter helm name:
        <FormControl value={name} onChange={(e)=>setName(e.target.value)} type="text"/>
        </div>
        <div>
        Enter boat name:
<FormControl value={boatName} onChange={(e)=>setBoatName(e.target.value)} type="text"/>
</div>
<div>
Enter boat number:
<FormControl value={boatNumber} onChange={(e)=>setBoatNumber(e.target.value)} type="text"/>
</div>
<div>
Enter boat PY:
<FormControl value={pY} onChange={(e)=>setPY(e.target.value)} type="number"/>
</div><div style={{paddingTop: "20px"}}>
<AwesomeButton onPress={newPerson}>Enter new person</AwesomeButton>
</div>
</>
    }}</Mutation>
    
    
    
    </>)
}