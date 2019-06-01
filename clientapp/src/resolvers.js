import gql from 'graphql-tag'

const GetLapsOfRace = gql`
query lapsOfRace($input: GetLapsOfRaceInput!, $eventInput: SpecificEventInput!, $raceStartInput: GetRaceStartInput!) {
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
            const GetLapsOfRaceInput = {
                input: {
                    eventId: currentRace.selectedRace.eventId
                },
                eventInput:
                {
                    eventData: {
                        eventId: currentRace.selectedRace.eventId
                    }
                },
                raceStartInput: {
                    eventId: currentRace.selectedRace.eventId
                }

            }
            let res = undefined
            try {
                res = cache.readQuery({ query: GetLapsOfRace, variables: GetLapsOfRaceInput })
            }
            catch (e) {
                console.log(e)
                return null;
            }
            if (res.specificEvent.length == 0) return null
            const result = res.specificEvent.map((elem) => { return { helm: elem, laps: res.getLapsOfRace.filter(element => element.userId == elem.userId) } })

            const returnVal = result.map(elem => {
                if (elem.laps.length == 0) return { userId: elem.helm.userId, correctedTime: null, __typename: "CorrectedTime" }
                const lastLapTime = elem.laps.sort((a, b) => a.lapTime - b.lapTime).reverse()[0].lapTime
                const elapsedTime = lastLapTime - res.getRaceStart
                const correctedTime = (elapsedTime / elem.helm.pY) * 1000;
                return { userId: elem.helm.userId, correctedTime: correctedTime, __typename: "CorrectedTime" }
            })

            return returnVal
        }
    }
}