// graphql.js

import { ApolloServer } from 'apollo-server-lambda';
import GraphQLLong from "graphql-type-long"
import typeDefs from './schema'
import { allBoatData, createBoat } from './dynamoResolvers/boatData'
import { recentEvents, allEvents, createEvent, removeEvent } from './dynamoResolvers/events'
import {signOn, specificEvent} from './dynamoResolvers/signOn'
import {newPerson, allHelms} from './dynamoResolvers/helm'

const resolvers = {
  Long: GraphQLLong,
  RootQuery: {
    allBoatData: () => allBoatData(),
    allEvents: () => allEvents(),
    recentEvents: (parent, args) => recentEvents(args.input),
    specificEvent: (parents, args) => specificEvent(args.input),
    allHelms: (parent, args) => allHelms(args.input)
  },
  RootMutation: {
    createBoat: (parent, args) => createBoat(args.input),
    createEvent: (parent, args) => createEvent(args.input),
    signOn: (parent, args) => signOn(args.input),
    removeEvent: (parent, args) => removeEvent(args.input),
    newPerson: (parent, args) => newPerson(args.input)
  }
};

const server = new ApolloServer({ typeDefs, 
  resolvers,
}); 
export {server}
exports.graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});