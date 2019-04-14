/* handler.js */
const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');
  const AWS = require('aws-sdk');
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const getGreeting = firstName => `Hello, ${firstName}.`

  // add to handler.js
const promisify = foo => new Promise((resolve, reject) => {
    foo((error, result) => {
      if(error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })


      // add method for updates
  const changeBoatData = (BoatName, Crew, PY) => promisify(callback =>
    dynamoDb.update({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { BoatName: BoatName, Crew: Crew },
      UpdateExpression: 'SET PY = :pY',
      ExpressionAttributeValues: {
        ':pY': PY
      }
    }, callback))
    .then(() => JSON.parse({BoatName: BoatName, Crew: Crew, PY: PY}))

  // Here we declare the schema and resolvers for the query
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'SailingWeb', // an arbitrary name
      fields: {
        // the query has a field called 'greeting'
        greeting: {
          // we need to know the user's name to greet them
          args: { firstName: { name: 'firstName', type: new GraphQLNonNull(GraphQLString) } },
          // the greeting message is a string
          type: GraphQLString,
          // resolve to a greeting message
          resolve: (parent, args) => getGreeting(args.firstName)
        }
      }
    }),
    mutation: new GraphQLObjectType({
        name: 'SetBoatData', // an arbitrary name
        fields: {
          setBoat: {
            args: {
              // we need the user's first name as well as a preferred nickname
              BoatName: { name: 'BoatName', type: new GraphQLNonNull(GraphQLString) },
              Crew: { name: 'Crew', type: new GraphQLNonNull(GraphQLInt) },
              PY: { name: 'PY', type: new GraphQLNonNull(GraphQLInt) }
            },
            type: GraphQLString,
            // update the nickname
            resolve: (parent, args) => changeBoatData(args.BoatName, args.Crew, args.PY)
          }
        }
      })
  })
  
  // We want to make a GET request with ?query=<graphql query>
  // The event properties are specific to AWS. Other providers will differ.
  module.exports.query = (event, context, callback) => graphql(schema, event.queryStringParameters.query)
    .then(
      result => callback(null, {statusCode: 200, body: JSON.stringify(result)}),
      err => callback(err)
    )