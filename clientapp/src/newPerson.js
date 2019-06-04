import React from 'react'
import RaceSelector from './raceSelector'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

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
    return (<>
    <RaceSelector/>
    
    <Mutation mutation={newPerson}>{(newPerson, {data,loading,error})=>{

        return <h1>Hello world</h1>
    }}</Mutation>
    
    
    
    </>)
}