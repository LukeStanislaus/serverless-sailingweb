// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');
import * as db from './dynamo';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type RootQuery {
    allBoatData: [BoatData]
  }
  schema{
    query: RootQuery
    mutation: RootMutation
  }
  type RootMutation {
    updateBoatData(input: UpdateBoatDataInput!): UpdateBoatDataPayload
  }
  type BoatData {
      boatName: String!
      crew: Int!
      pY: Int!
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
    TableName: process.env.DYNAMODB_TABLE,    
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
  TableName: process.env.DYNAMODB_TABLE,
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
  Query: {
    allBoatData: () => getAllBoatData()
  },
  Mutation: {
    updateBoatData: (parent, args) => changeBoatData(args.input)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();