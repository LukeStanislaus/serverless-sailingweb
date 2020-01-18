import { loader } from 'graphql.macro'
const query = loader('./graphqlQueries/ORDER_BY.graphql')
export const resolvers = {
    Mutation: {
        selectRace: (_, { input }, { cache }) => {
            input == null ? cache.writeData({ data: { selectedRace: null } }) : cache.writeData({ data: { selectedRace: { ...input.Event } } })
        },
        selectOrderBy: (_, { input }, { cache }) => {
            const { orderBy } = cache.readQuery({ query })
            let reverse = orderBy.type === input.SelectOrderByInput.type ? !orderBy.reverse : false
            if(input.SelectOrderByInput.type == null) reverse = orderBy.reverse;
            cache.writeData({data:{orderBy:{ reverse: reverse, type: input.SelectOrderByInput.type, __typename: "OrderBy" }} })
            
        }
    },

    Query: {

    }
}