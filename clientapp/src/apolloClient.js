import {ApolloClient} from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory'
import {resolvers} from './resolvers'
import {typeDefs} from './schema.graphql'
import { RetryLink } from "apollo-link-retry"
import { ApolloLink } from "apollo-link"


const cache = new InMemoryCache({
  dataIdFromObject: object =>{ 
    switch (object.__typename)
    {
      case "SignOn":
      case "CorrectedTime":
    return object.eventId+object.userId
    default: 
    return object.eventId +object.lapId || null
  }
    
  }
});

const RetryLinker = new RetryLink({
  delay: {
    initial: 300,
    max: 10000,
    jitter: true
  },
  attempts: {
    max: 500,
    retryIf: (error, _operation) => {
      return !!error}
  }
})
const link =new HttpLink({
  uri: "https://n9v7x5w1g8.execute-api.us-east-1.amazonaws.com/dev/graphql",
  headers: {
      //'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Credentials': true,    
      //"Access-Control-Allow-Methods": "*"

    },
    mode: "cors"
  })
export const client = new ApolloClient({
  link: ApolloLink.from([RetryLinker, link]),
  cache: cache,
  typeDefs,
  resolvers
});

cache.writeData({
  data: {
    selectedRace: null,
    orderBy: {
    reverse: false,
    type: "Place",
    __typename: "OrderBy"
    },
    error: null
}})