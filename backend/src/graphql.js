// graphql.js

import { ApolloServer } from 'apollo-server-lambda';
import typeDefs from './schema.graphql'
import { allBoatData, createBoat } from './dynamoResolvers/boatData'
import { recentEvents, allEvents, createEvent, removeEvent, startRace, getRaceStart, updateRace } from './dynamoResolvers/events'
import {signOn, specificEvent, removeFromRace} from './dynamoResolvers/signOn'
import {newPerson, allHelms, getBoatsOfHelm, removePerson} from './dynamoResolvers/helm'
import {createLap, getLapsOfRace, updateLap} from './dynamoResolvers/laps'

const resolvers = {
  RootQuery: {
    allBoatData: () => allBoatData(),
    allEvents: () => allEvents(),
    recentEvents: (parent, args) => recentEvents(args.input),
    specificEvent: (parents, args) => specificEvent(args.input),
    allHelms: (parent, args) => allHelms(args.input),
    getBoatsOfHelm: (parent, args) => getBoatsOfHelm(args.input),
    getLapsOfRace: (parent, args)=> getLapsOfRace(args.input),
    getRaceStart: (parent, args) => getRaceStart(args.input),
  },
  RootMutation: {
    createBoat: (parent, args) => createBoat(args.input),
    createEvent: (parent, args) => createEvent(args.input),
    signOn: (parent, args) => signOn(args.input),
    removeEvent: (parent, args) => removeEvent(args.input),
    newPerson: (parent, args) => newPerson(args.input),
    createLap: (parent, args) => createLap(args.input),
    updateLap: (parent, args) => updateLap(args.input),
    startRace: (parent, args) => startRace(args.input),
    removeFromRace: (parent, args) => removeFromRace(args.input),
    removePerson: (parent, args) => removePerson(args.input),
    updateRace: (parent, args) => updateRace(args.input),
  }
};

const server = new ApolloServer({ typeDefs, 
  resolvers,
  playground:{
tabs:[{endpoint:"http://localhost:3000/dev/graphql"}]
  }
}); 
export {server}
exports.graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});