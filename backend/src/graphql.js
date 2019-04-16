// graphql.js

import { ApolloServer } from 'apollo-server-lambda';
import GraphQLLong from "graphql-type-long"
import typeDefs from './schema'
import { allBoatData, createBoat } from './dynamoResolvers/boatData'
import { recentEvents, allEvents, createEvent } from './dynamoResolvers/events'
import {signOn, specificEvent} from './dynamoResolvers/signOn'

const resolvers = {
  Long: GraphQLLong,
  RootQuery: {
    allBoatData: () => allBoatData(),
    allEvents: () => allEvents(),
    recentEvents: (parent, args) => recentEvents(args.input),
    specificEvent: (parents, args) => specificEvent(args.input)
  },
  RootMutation: {
    createBoat: (parent, args) => createBoat(args.input),
    createEvent: (parent, args) => createEvent(args.input),
    signOn: (parent, args) => signOn(args.input)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();