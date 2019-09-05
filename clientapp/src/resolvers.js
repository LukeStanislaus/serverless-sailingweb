import { loader } from 'graphql.macro'
const ORDER_BY = loader('./graphqlQueries/ORDER_BY.graphql')

export const resolvers = {
    Mutation: {
        selectRace: (_, { input }, { cache }) => {
            input == null ? cache.writeData({ data: { selectedRace: null } }) : cache.writeData({ data: { selectedRace: { ...input.Event } } })
        },
        orderBy: (_, { input }, { cache }) => {
            const { OrderBy } = cache.readQuery(ORDER_BY)
            const reverse = OrderBy.type == input.OrderByInput.type ? !OrderBy.Reverse : false
            const data = { ORDER_BY: { reverse: reverse, type: input.type } }
            cache.writeQuery({ ORDER_BY, data })
            return data
        }
    },

    Query: {

    }
}