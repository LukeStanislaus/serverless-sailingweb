import React from 'react'
import gql from 'graphql-tag'
import {Query} from 'react-apollo'
const allHelms = gql`
query {
  allHelms{
    name
    userId
    boatName
    boatNumber
    pY
  }
}`

const signOn = () => {
    return <Query query={allHelms}>
        {({loading, error, data})=>{
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`
            return (
                <h1>{data.toString()}</h1>
            )
        }}
</Query>
}
export default signOn