import React from 'react'
import RaceRow from './raceRow'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const correctedTimeQuery = gql`
query correctedTimes {
correctedTimes @client {
    userId
    correctedTime
}
}

`

export default (props) => {

    return <>
        <Query query={correctedTimeQuery} >{({ data, loading, error }) => {
            if (loading) return <tr />
            if (error) { console.log(error); return <tr></tr> }
            if (data.correctedTimes == undefined) return <tr></tr>
            let RaceRows = []
            let something = data.correctedTimes.sort((a,b)=> a.correctedTime - b.correctedTime)
            something = something.map((elem, index)=> {return {...elem, place: index+1}})
            props.people.forEach((element, index) => {
                let correctedTime = null
                let arr = something.filter(elem => elem.userId == element.helm.userId)
                if (arr.length != 0) correctedTime = arr[0].correctedTime
                RaceRows.push(<RaceRow eventId={props.eventId} key={index} place={arr[0].place} maxLaps={props.maxLaps} correctedTime={correctedTime} person={element} />)
            });
            return RaceRows
        }}

        </Query>
    </>
}

