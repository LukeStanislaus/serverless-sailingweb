import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Autocomplete from 'react-autosuggest'
import { AwesomeButtonProgress } from 'react-awesome-button'
import "react-awesome-button/dist/styles.css";
import Select from 'react-select'
import SelectRace from './raceSelector'
import { Link } from '@reach/router'
import { loader } from 'graphql.macro'
const SELECTED_RACE = loader('./graphqlQueries/SELECTED_RACE.graphql')
const GET_BOATS = loader('./graphqlQueries/GET_BOATS.graphql')
const SIGN_ON = loader('./graphqlQueries/SIGN_ON.graphql')
const ALL_HELMS = loader('./graphqlQueries/ALL_HELMS.graphql')
const SPECIFIC_EVENT = loader('./graphqlQueries/SPECIFIC_EVENT.graphql')

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
      type: 'search',
      value: crew,
      onChange: (e) => { setCrew(e.target.value) }
    }
    }
  />

}

function useBoatClass(boatClass, setBoatClass, boatClassVariables) {
  const { loading, error, data } = useQuery(GET_BOATS, { skip: boatClassVariables.input.helmName == null, variables: boatClassVariables })
  if (loading || boatClassVariables.input.helmName == null || data === undefined) return <Select />
  if (error) return `Error! ${error.message}`
  return <Select
    isClearable
    isSearchable={false}
    key={"BoatClass"}
    value={boatClass}
    onChange={val => setBoatClass(val)}
    options={data.getBoatsOfHelm}
    onSelect={(val) => setBoatClass(val)}
    getOptionLabel={elem => elem.boatName + ", " +
      elem.boatNumber + ". (PY " + elem.pY + ")"}
  />
}

function useHelmName(name, setName) {
  const { loading, error, data } = useQuery(ALL_HELMS)
  if (error) return `Error! ${error.message}`
  if (loading) return <Select />
  return <Select
    isClearable
    key={"HelmName"}
    options={data.allHelms.filter((value, index, self) =>{
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
  const [crew, setCrew] = useState("")
  const [name, setName] = useState("")
  const [boatClass, setBoatClass] = useState(null)
  const [notes, setNotes] = useState("")

  const signOnInput = {
    input: {
      signOn: {
        userId: name == null ? null : name.userId,
        helmName: name == null ? null : name.name,
        boatName: boatClass == null ? null : boatClass.boatName,
        boatNumber: boatClass == null ? null : boatClass.boatNumber,
        crewName: crew === "" ? null : crew,
        pY: boatClass == null ? null : boatClass.pY,
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
    setBoatClass("")
  }, [name])
  return (<>
    <h1 style={{ paddingBottom: "30px" }}>Sign onto a race</h1>
    <SelectRace AfterSelection={() => <div>done</div>} />
    Helm Name:
{useHelmName(name, setName)}
    <div>
      Boat Class:
        {useBoatClass(boatClass, setBoatClass, boatClassVariables)}
    </div>
    Crew Name:
{useCrewName(crew, setCrew)}
    Notes
        <input value={notes} onChange={e => setNotes(e.target.value)} /><div align="center" style={{ "paddingTop": "50px" }}>
      {useSelectedRace(boatClass, name, signOnInput)}

      <div><Link className={"navbar-text"} to="/NewPerson">Name not in list? Click here.</Link></div>

    </div>
  </>
  )
}
function useSelectedRace(boatClass, name, signOnInput) {
  let obj = null
  const { data, loading, error } = useQuery(SELECTED_RACE)
  const queryData = data;
  if (loading) obj = "Loading"
  if (error) obj = 'error'

  const [signOn] = useMutation(SIGN_ON, {
    update(cache, { data: { signOn: { signOn: person } } }) {
      const specificEventInputVariables = {
        input: {
          eventData: {
            eventId: queryData.selectedRace.eventId
          }
        }
      }
      try {
        let helmsInRaces = cache.readQuery({ query: SPECIFIC_EVENT, variables: specificEventInputVariables })
        let helmsInSpecificRace = helmsInRaces.specificEvent.concat(person)
        cache.writeQuery({ query: SPECIFIC_EVENT, variables: specificEventInputVariables, data: { specificEvent: helmsInSpecificRace } })
      }
      catch (e) {
        if (e.toString().substring(0, 9) !== "Invariant") throw e;
      }
    }
  })



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
      let x= await signOn(variables);
      console.log(x);
      next(x.data.signOn!==null)
    }}
    type="primary"
    style={{
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