import {ApolloClient} from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory'
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
  cache: new InMemoryCache()
});