// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');
import * as db from './dynamo';
import GraphQLLong from "graphql-type-long"

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
scalar Long
  type RootQuery {
    allBoatData: [BoatData]
    allRaces: [Race]
    recentRaces(input: RecentRacesInput!): [Race]
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
  type RootMutation {
    updateBoatData(input: UpdateBoatDataInput!): UpdateBoatDataPayload
    createRaces(input: CreateRacesInput!): CreateRacesPayload
  }
  type BoatData {
      boatName: String!
      crew: Int!
      pY: Int!
  }
  type Race {
    raceId: ID!
    raceName: String!
    eventTimeStamp: Long!
  }
  input RecentRacesInput{
    start: Long!
    end: Long!
  }
  type CreateRacesPayload{
    result: String
  }
  input CreateRacesInput{
    raceId: ID!
    raceName: String!
    eventTimeStamp: Long!
    calendarData: calendarData
  }
  input Creator{
    email: String
    displayName: String
    self: Boolean
  }
  input Organizer{
    email: String
    displayName: String
    self: Boolean
  }
  input Time{
    dateTime: String
  }
  input calendarData{
    kind: String
    etag: String
    id: String
    status: String
    htmlLink: String
    created: String
    updated: String
    summary: String
    creator: Creator
    organizer: Organizer
    start: Time
    end: Time
    iCalUID: String
    sequence: Int
    location: String
  }
  input UpdateBoatDataInput{
    boatName: String!
    crew: Int!
    pY: Int!
  }
  type UpdateBoatDataPayload{
    boatData: BoatData
  }
`;

const getAllBoatData = ()=> {
  let params = {
    TableName: "BoatData",    
    AttributesToGet: [
      'boatName',
      'pY',
      'crew',
    ],
  }
  return db.scan(params)
}
const getAllRaces = ()=> {
  let params = {
    TableName: "Races",    
    AttributesToGet: [
      'raceId',
      'eventTimeStamp',
      'calendarData',
      'raceName'
    ],
  }
  return db.scan(params)
}
    // method for updates
    const changeBoatData = (args) => {
let params = {
  TableName: "BoatData",
  Key: { boatName: args.boatName, crew: args.crew },
  UpdateExpression: 'SET pY = :pY',
  ExpressionAttributeValues: {
  ':pY': args.pY
  },
  ReturnValues: "ALL_NEW"
}
return db.updateItem(params, {boatData:args})
}
    // method for updates
    const createRaces = (args) => {
      let params = {
        TableName: "Races",
        Key: { raceId: args.raceId, eventTimeStamp: args.eventTimeStamp },
        UpdateExpression: 'SET raceName = :raceName, calendarData = :calendarData',
        ExpressionAttributeValues: {
        ':raceName': args.raceName,
        ':calendarData': args.calendarData == null? " " : args.calendarData
        },
        ReturnValues: "ALL_NEW"
      }
      return db.updateItem(params, {"Success!"})
      }

function recentRaces(args){
let params = {
  TableName: "Races",
  KeyConditionExpression: "eventTimeStamp > :start and eventTimeStamp < :end",
  ExpressionAttributeValues: {
    ':start': args.start,
    ':end': args.end
  }
}
  return db.queryItem(params)
}

// Provide resolver functions for your schema fields
const resolvers = {
  Long: GraphQLLong,
  RootQuery: {
    allBoatData: () => getAllBoatData(),
    allRaces: () => getAllRaces(),
    recentRaces: (parent, args) => recentRaces(args.input)
  },
  RootMutation: {
    updateBoatData: (parent, args) => changeBoatData(args.input),
    createRaces: (parent, args) => createRaces(args.input)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();