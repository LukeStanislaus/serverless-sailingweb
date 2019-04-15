// graphql.js

import { ApolloServer } from 'apollo-server-lambda';
import GraphQLLong from "graphql-type-long"
import typeDefs from './schema'
import { getAllBoatData, changeBoatData } from './dynamoResolvers/boatData'
import { recentEvents, getAllEvents, createEvents } from './dynamoResolvers/events'
import {signOn, specificRace} from './dynamoResolvers/signOn'

const resolvers = {
  Long: GraphQLLong,
  RootQuery: {
    allBoatData: () => getAllBoatData(),
    allEvents: () => getAllEvents(),
    recentEvents: (parent, args) => recentEvents(args.input),
    specificRace: (parents, args) => specificRace(args.input)
  },
  RootMutation: {
    updateBoatData: (parent, args) => changeBoatData(args.input),
    createEvents: (parent, args) => createEvents(args.input),
    signOn: (parent, args) => signOn(args.input)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();