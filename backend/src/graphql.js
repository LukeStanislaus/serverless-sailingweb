// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');
import * as db from './dynamo';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    BoatData(BoatName: String!, Crew: Int): [BoatData!]!
  }
  type Mutation{
    BoatData(BoatName: String!, Crew: Int!, PY: Int!): String
  }
  type BoatData{
      BoatName: String!
      Crew: Int!
      PY: Int!
  }
`;

    // method for updates
    const changeBoatData = (BoatName, Crew, PY) => {
let params = {
  TableName: process.env.DYNAMODB_TABLE,
  Key: { BoatName: BoatName, Crew: Crew },
  UpdateExpression: 'SET PY = :pY',
  ExpressionAttributeValues: {
  ':pY': PY
  },
  ReturnValues: "ALL_NEW"
}
return db.updateItem(params)}


// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    BoatData: () => 'Hello world!',
  },
  Mutation: {
    BoatData: (parent, args) => changeBoatData(args.BoatName, args.Crew, args.PY)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();