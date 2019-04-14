// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');
import * as db from './dynamo';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type RootQuery {
    allBoatData: [BoatData]
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
  type CreateRacesPayload{
    result: String
  }
  input CreateRacesInput{
    raceId: ID!
    name: String!
    eventTimeStamp: String!
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
      'name'
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
        UpdateExpression: 'SET name = :name, calendarData = :calendarData',
        ExpressionAttributeValues: {
        ':name': args.name,
        ':calendarData': args.calendarData
        },
        ReturnValues: "ALL_NEW"
      }
      return db.updateItem(params, "Success")
      }


// Provide resolver functions for your schema fields
const resolvers = {
  RootQuery: {
    allBoatData: () => getAllBoatData(),
    allRaces: () => getAllRaces()
  },
  RootMutation: {
    updateBoatData: (parent, args) => changeBoatData(args.input),
    createRaces: (parent, args) => createRaces(args.input)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();