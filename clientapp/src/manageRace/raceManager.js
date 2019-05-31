import React from 'react'
import RaceHeader from './raceHeader'
import RaceBody from './raceBody'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const getLapsOfRaceAndSignOn = gql`
query lapsOfRaceAndSignOn($input: GetLapsOfRaceInput!, $eventInput: SpecificEventInput!){
    getLapsOfRace(input:$input){
      userId
      eventId
      lapTime
      lapId
    }
    specificEvent(input: $eventInput){
        userId
        helmName
        boatName
        boatNumber
        crew
        pY
        notes
        crewName
    }
}`
export default (props) => {
    const getLapsOfRaceAndSignOnInput = {
        input:
        {
            eventId:
                props.selectedRace.eventId
        },
        eventInput:
        {
            eventData: {
                eventId: props.selectedRace.eventId
            }
        }

    }
    return <table style={{ border: "1px solid black" }}><tbody>
        <Query query={getLapsOfRaceAndSignOn} variables={getLapsOfRaceAndSignOnInput}>{({ data, loading, error }) => {
            if (loading) return <tr />;
            let max = 0
            let array = data.specificEvent.map(element => {
                let laps = data.getLapsOfRace.filter(elem => elem.userId === element.userId);
                let person = { helm: element, laps: laps };
                if (laps.length > max) max = laps.length
                return person
            });
            return (<><RaceHeader maxLaps={max}/>
                <RaceBody eventId={props.selectedRace.eventId} people={array} maxLaps={max}/></>)
        }}
        </Query></tbody>
    </table>
}

