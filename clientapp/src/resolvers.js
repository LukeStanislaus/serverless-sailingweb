import gql from 'graphql-tag'

const GetLapsOfRace = gql`
query lapsOfRace($input: GetLapsOfRaceInput!, $eventInput: SpecificEventInput!) {
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

const GetCurrentRace = gql`query selectedRace {
    selectedRace @client{
        eventName
        eventId
        eventTimeStamp
}
}`

export const resolvers = {
    Mutation: {
        selectRace: (_, { input }, { cache }) => {
            input == null ? cache.writeData({ data: { selectedRace: null } }) : cache.writeData({ data: { selectedRace: { ...input.Event } } })
        }
    },

    Query: {
        correctedTimes: async (_, __, { cache }) => {
            const currentRace = cache.readQuery({ query: GetCurrentRace })
            console.log(currentRace.selectedRace.eventId)
            const GetLapsOfRaceInput = {
                input: {
                    eventId: currentRace.selectedRace.eventId
                },
                eventInput:
                {
                    eventData: {
                        eventId: currentRace.selectedRace.eventId
                    }
                }

            }
            console.log(GetLapsOfRaceInput);
            let res = cache.readQuery({ query: GetLapsOfRace, variables: GetLapsOfRaceInput })
            const result =res.specificEvent.map((elem) => {return{helm: elem, laps: res.getLapsOfRace.filter(element => element.userId == elem.userId)}})

            const returnVal = result.map(elem => {return { userId: elem.helm.userId, correctedTime: 0, __typename: "CorrectedTime"}})
            console.log(returnVal);
            return returnVal
        }
    }
}