import {ApolloClient} from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory'
import {resolvers} from './resolvers'
import {typeDefs} from './schema.graphql'

const cache = new InMemoryCache({
  dataIdFromObject: object =>{ 
    switch (object.__typename)
    {
      case "CorrectedTime":
    return object.eventId+object.userId
    default: 
    return object.eventId +object.lapId || null
  }
    
  }
});
const link =new HttpLink({
  uri: "https://hfnajybwp9.execute-api.us-east-1.amazonaws.com/dev/graphql",
  headers: {
      //'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Credentials': true,    
      //"Access-Control-Allow-Methods": "*"

    },
    mode: "cors"
  })
export const client = new ApolloClient({
  link: link,
  cache: cache,
  typeDefs,
  resolvers
});

cache.writeData({
  data: {
    selectedRace: null
    }
})