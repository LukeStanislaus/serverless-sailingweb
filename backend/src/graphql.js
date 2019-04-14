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

  }
  input CreateRacesInput{
    raceId: ID!
    name: String!
    eventTimeStamp: String!
    calendarData: calendarData
  }
  type Creator{
    email: String
    displayName: String
    self: Boolean
  }
  type Organizer{
    email: String
    displayName: String
    self: Boolean
  }
  type Time{
    dateTime: String
  }
  type calendarData{
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


// Provide resolver functions for your schema fields
const resolvers = {
  RootQuery: {
    allBoatData: () => getAllBoatData()
  },
  RootMutation: {
    updateBoatData: (parent, args) => changeBoatData(args.input),
    createRaces: (parent, args) => createRaces(args.input)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();