import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { AwesomeButtonProgress } from 'react-awesome-button'
import { FormControl } from 'react-bootstrap'
import Autocomplete from 'react-autosuggest'
import { loader } from 'graphql.macro'
const GET_BOATS = loader('./graphqlQueries/GET_BOATS.graphql')
const ALL_HELMS = loader('./graphqlQueries/ALL_HELMS.graphql')
const NEW_PERSON = loader('./graphqlQueries/NEW_PERSON.graphql')

let NewPerson = () => {
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
  let newPersonObj = null
  const { loading, data } = useQuery(gql`query getBoats {
    allBoatData{
      boatName
      crew
      pY
    }
    }`)


  let [newPersonFunc] = useMutation(NEW_PERSON, { variables: newPersonInput, refetchQueries: [{ query: ALL_HELMS }, 
    {query:GET_BOATS, variables:{input:{helmName:name}}}] 
  })
  let [suggestions, setSuggestions] = useState(null)
  if (loading) return <>loading</>
  if(suggestions == null) setSuggestions(data.allBoatData === undefined ? [] : data.allBoatData.map((elem) =>
  { return { elem: elem, id: elem.boatName, label: elem.boatName, name: elem.boatName } }))
  newPersonObj = <><div>
    Enter helm name:
            <FormControl value={name} onChange={(e) => setName(e.target.value)} type="text" />
  </div>
    <div>
      Enter boat class:
    <Autocomplete type={"text"}
        inputProps={{ className: "form-control",
        value:boatName,
        onChange:(e) => { setBoatName(e.target.value); },
        onSelect:(val) => { 
          let boat = data.allBoatData.find(elem => elem.boatName === val)
          if(boat===undefined) return;
          setPY(boat.pY); 
          setBoatName(val)} 
      }}
        key={"Boat"}
        onSuggestionsClearRequested={()=>setSuggestions([])}
        onSuggestionsFetchRequested={({value})=>setSuggestions(data.allBoatData === undefined ? [] : 
          data.allBoatData.map((elem) => { return { elem: elem, id: elem.boatName, label: elem.boatName, name: elem.boatName } })
          .filter(elem=>elem.name.toLowerCase().includes(value.toLowerCase())))}
        getSuggestionValue={(item) => item.label}
        suggestions={suggestions==null?[]:suggestions}
        
    onSuggestionSelected={(e,{suggestionValue})=>{          
      let boat = data.allBoatData.find(elem => elem.boatName === suggestionValue)
      if(boat===undefined) return;
      setPY(boat.pY); 
      setBoatName(suggestionValue)
    } 
    }
        renderSuggestion={(item, {isHighlighted}) =>
          <div key={item.elem.boatName} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {item.elem.boatName + " (PY " + item.elem.pY + ")"}
          </div>
        }
        
      />
    </div>
    <div>
      Enter boat number:
    <FormControl value={boatNumber} onChange={(e) => setBoatNumber(e.target.value)} type="text" />
    </div>
    <div>
      Enter boat PY:
    <FormControl value={pY} onChange={(e) => parseInt(e.target.value)>0?setPY(parseInt(e.target.value)):setPY(1)} type="number" />
    </div><div align={"center"} style={{ paddingTop: "20px" }}>
    <AwesomeButtonProgress
      disabled={name ===""|| boatName===""||boatNumber ===""||pY===""}
        //cssModule={AwesomeButtonStyles} 
        type={"primary"}
        style={{"width": "100%"}}
        onPress={async (element, next) => { await newPersonFunc(); next(); }}>
        Enter new person
        </AwesomeButtonProgress>
    </div>
  </>
  return (<>
    <h1>Enter a new person</h1>

    {newPersonObj}


  </>)
}
export default NewPerson