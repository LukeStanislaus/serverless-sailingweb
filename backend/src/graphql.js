// graphql.js

import { ApolloServer } from 'apollo-server-lambda';
import GraphQLLong from "graphql-type-long"
import typeDefs from './schema.graphql'
import { allBoatData, createBoat } from './dynamoResolvers/boatData'
import { recentEvents, allEvents, createEvent, removeEvent } from './dynamoResolvers/events'
import {signOn, specificEvent} from './dynamoResolvers/signOn'
import {newPerson, allHelms, getBoatsOfHelm} from './dynamoResolvers/helm'
import {createLap, getLapsOfRace, updateLap} from './dynamoResolvers/laps'

const resolvers = {
  Long: GraphQLLong,
  RootQuery: {
    allBoatData: () => allBoatData(),
    allEvents: () => allEvents(),
    recentEvents: (parent, args) => recentEvents(args.input),
    specificEvent: (parents, args) => specificEvent(args.input),
    allHelms: (parent, args) => allHelms(args.input),
    getBoatsOfHelm: (parent, args) => getBoatsOfHelm(args.input),
    getLapsOfRace: (parent, args)=> getLapsOfRace(args.input)
  },
  RootMutation: {
    createBoat: (parent, args) => createBoat(args.input),
    createEvent: (parent, args) => createEvent(args.input),
    signOn: (parent, args) => signOn(args.input),
    removeEvent: (parent, args) => removeEvent(args.input),
    newPerson: (parent, args) => newPerson(args.input),
    createLap: (parent, args) => createLap(args.input),
    updateLap: (parent, args) => updateLap(args.input)
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