import React from 'react'
import RaceHeader from './raceHeader'
import RaceBody from './raceBody'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import StartRaceButton from './startRaceButton'
import RaceTimer from './raceTimer'

const getLapsOfRaceAndSignOn = gql`
query lapsOfRaceAndSignOn($input: GetLapsOfRaceInput!, $eventInput: SpecificEventInput!, $raceStartInput:GetRaceStartInput!){
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
  getRaceStart(input: $raceStartInput)
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
        },
        raceStartInput: {
            eventId: props.selectedRace.eventId
        }

    }

    return <Query query={getLapsOfRaceAndSignOn} variables={getLapsOfRaceAndSignOnInput}>{({ data, loading, error }) => {
            if (loading) return <div />;
            let max = 0
            let array = data.specificEvent.map(element => {
                let laps = data.getLapsOfRace.filter(elem => elem.userId === element.userId);
                let person = { helm: element, laps: laps };
                if (laps.length > max) max = laps.length
                return person
            });
            return (<>{data.getRaceStart === null ?
<StartRaceButton shouldEarlyStart={true} buttonText={"Press here to start the race"} startTime={new Date().getTime()} eventId={props.selectedRace.eventId} />:
 <RaceTimer eventId={props.selectedRace.eventId} startTime={data.getRaceStart}/>}
                <table style={{ border: "1px solid black" }}><tbody><RaceHeader maxLaps={max} />
                    <RaceBody eventId={props.selectedRace.eventId} people={array} maxLaps={max} /></tbody>
                </table></>)
        }}
        </Query>
}

