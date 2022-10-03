import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Autocomplete from 'react-autosuggest'
import { AwesomeButtonProgress } from 'react-awesome-button'
import "react-awesome-button/dist/styles.css";
import Creatable from 'react-select/creatable'
import SelectRace from './raceSelector'
import { LinkContainer } from 'react-router-bootstrap'
import { loader } from 'graphql.macro'
import Nav from 'react-bootstrap/Nav';
const SELECTED_RACE = loader('./graphqlQueries/SELECTED_RACE.graphql')
const GET_BOATS = loader('./graphqlQueries/GET_BOATS.graphql')
const SIGN_ON = loader('./graphqlQueries/SIGN_ON.graphql')
const ALL_HELMS = loader('./graphqlQueries/ALL_HELMS.graphql')
const NEW_PERSON = loader('./graphqlQueries/NEW_PERSON.graphql')

function useCrewName(crew, setCrew) {
  const { loading, error, data } = useQuery(ALL_HELMS)

  const [suggestions, setSuggestions] = useState(null)

  if (suggestions == null) setSuggestions(data === undefined ? [] : data.allHelms.map(elem => { return elem.name }).filter(onlyUnique))
  if (loading) return <input />
  if (error) return `Error! ${error.message}`
  return <Autocomplete
    key={"CrewName"}
    getSuggestionValue={(item) => { return item }}
    suggestions={suggestions == null ? [] : suggestions}
    renderSuggestion={(item, { isHighlighted }) =>
      <div key={item} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
        {item}
      </div>
    }
    onSuggestionSelected={(e, { suggestionValue }) => setCrew(suggestionValue)}
    onSuggestionsClearRequested={() => setSuggestions([])}
    onSuggestionsFetchRequested={({ value }) =>
      setSuggestions(data.allHelms.map(elem => { return elem.name })
        .filter(onlyUnique)
        .filter(elem => elem.toString().toLowerCase().includes(value.toString().toLowerCase())))}
    inputProps={{
      className: "form-control",
      value: crew,
      onChange: (e) => { setCrew(e.target.value) },
      placeholder: "Enter..."
    }
    }
  />

}

function useBoatClass(boatName, setBoatName, boatClassVariables, newPerson, setNewPerson, pY, setPY, boatNumber, setBoatNumber) {
  const { loading, error, data } = useQuery(GET_BOATS, { skip: boatClassVariables.input.helmName == null, variables: boatClassVariables })
  if (loading) return <Creatable isLoading />
  if (error) return `Error! ${error.message}`
  return <><Creatable
    isClearable

    onCreateOption={val => {
      console.log(val)
      setNewPerson(true)
      setBoatName(val)
    }}
    key={"BoatClass"}
    value={boatName? { boatName: boatName, pY: pY, boatNumber: boatNumber }:null}
    onChange={(val) => {
      console.log(val)
      if(val){
      setBoatName(val.boatName)
      setBoatNumber(val.boatNumber)
      setPY(val.pY)
      
      }
      else{
        setBoatName(null)
        setBoatNumber(null)
        setPY(null)
      }
      setNewPerson(false)
    }}
    options={data ? data.getBoatsOfHelm : []}

    getOptionLabel={elem =>{
      if(elem.value) return elem.value + ", " +
      "0000" + ". (PY 1000)"
      console.log(elem)
      return elem.boatName + ", " +
      elem.boatNumber + ". (PY " + elem.pY + ")"}
    }
  />
    {newPerson && <>
      New Boat Number:
      <input value={boatNumber} onChange={e => {
        setBoatNumber(e.target.value)
      }} className='form-control' />
      New Boat PY:
      <input type={'number'} value={pY} onChange={
        e => {
          pY = parseInt(e.target.value)

          if(pY<1) setPY(1)
          else setPY(pY)
        }
      } className='form-control' />
    </>
    }</>
}

function useHelmName(name, setName) {
  const { loading, error, data } = useQuery(ALL_HELMS)
  if (error) return `Error! ${error.message}`
  if (loading) return <Creatable isLoading />
  return <Creatable
    isClearable
    key={"HelmName"}
    formatOptionLabel={elem => {
      if (elem.__isNew__) {
        return elem.label
      }
      return elem.name
    }
    }
    options={data.allHelms.filter((value, index, self) => {
      return index === self.findIndex((t) => (
        t.name === value.name
      ))
    })}
    value={name}
    getOptionLabel={elem => elem.name}
    onChange={(val) => { setName(val); }}
  />

}

function SignOn() {
  const [newPerson, setNewPerson] = useState(false)
  const [crew, setCrew] = useState("")
  const [name, setName] = useState("")
  const [boatName, setBoatName] = useState('')
  const [boatNumber, setBoatNumber] = useState('')
  const [pY, setPY] = useState(1000)
  const [notes, setNotes] = useState("")
  function reset() {
    setCrew("")
    setName("")
    setBoatName("")
    setNotes("")
  }
  const signOnInput = {
    input: {
      signOn: {
        userId: name == null ? null : name.userId,
        helmName: name == null ? null : name.name,
        boatName: boatName == null ? null : boatName.boatName,
        boatNumber: boatName == null ? null : boatName.boatNumber,
        crewName: crew === "" ? null : crew,
        pY: boatName == null ? null : boatName.pY,
        notes: notes === "" ? null : notes

      }
    }
  }
  const boatClassVariables = {
    input: {
      helmName: name == null ? null : name.name
    }
  }
  useEffect(() => {
    setBoatName("")
  }, [name])
  return (<>
    <h1 style={{ paddingBottom: "30px" }}>Sign onto a race</h1>
    <SelectRace AfterSelection={() => <div>done</div>} />
    Helm Name:
    {useHelmName(name, setName)}
    <div>
      Boat Class:
      {useBoatClass(boatName, setBoatName, boatClassVariables, newPerson, setNewPerson, pY, setPY, boatNumber, setBoatNumber)}
    </div>
    Crew Name:
    {useCrewName(crew, setCrew)}
    Notes:
    <input placeholder='Enter...' className={"form-control"} value={notes} onChange={e => setNotes(e.target.value)} />
    <div align="center" style={{ "paddingTop": "50px" }}>
      {useSelectedRace(boatName, name, signOnInput, reset)}

      <div><LinkContainer to="/NewPerson"><Nav.Link>Name not in list? Click here. </Nav.Link></LinkContainer></div>
      <iframe title="Weather" width="650" height="450" src="https://embed.windy.com/embed2.html?lat=51.660&lon=-1.932&
      detailLat=51.471&detailLon=-2.082&width=650&height=450&zoom=11&level=surface&overlay=wind&product=ecmwf&menu=&
      message=&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=kt&metricTemp=%C2%B0C&
      radarRange=-1" frameBorder="0"></iframe>
    </div>
  </>
  )
}

function useSelectedRace(boatClass, name, signOnInput, reset) {
  let obj = null
  const { data, loading, error } = useQuery(SELECTED_RACE)
  const queryData = data;
  if (loading) obj = "Loading"
  if (error) obj = 'error'
  const newPersonInput = {
    input: {
      newPersonData: {
        name: name,
        boatName: boatClass,
        // boatNumber: boatNumber,
        // pY: pY
      }
    }
  }
  const [createPerson] = useMutation(NEW_PERSON, {
    variables: newPersonInput, refetchQueries: [{ query: ALL_HELMS },
    { query: GET_BOATS, variables: { input: { helmName: name } } }]
  })
  const [signOn] = useMutation(SIGN_ON)



  obj = (<AwesomeButtonProgress
    disabled={(boatClass === "" || name === "" || queryData.selectedRace === null)}
    ripple
    onPress={async (e, next) => {
      const variables = {
        variables: {
          input: {
            signOn: {
              ...signOnInput.input.signOn, eventId: queryData.selectedRace.eventId
            }
          }
        }
      };

      let x = await signOn(variables);
      reset()
      x.data.signOn !== null ? next(true) : next(true, "Already in race!")
    }}
    size="large"
    type="primary"
    style={{
      "width": "100%",
      "--button-raise-level": "4px",
      "--button-hover-pressure": 3, "zIndex": 0
    }}>Enter Race</AwesomeButtonProgress>)



  return obj
}

function onlyUnique(value, index, self) {
  return index === self.findIndex((t) => (
    t === value
  ))
}
export default SignOn