import React, {useEffect, useState} from 'react';
import { Link, Router } from '@reach/router'
import { ApolloProvider, useQuery } from '@apollo/react-hooks'
//import { client } from './apolloClient'
import SignOn from './signOn'
import ViewRace from './viewRace'
import ManageRace from './manageRace/manageRace'
import { } from 'react-bootstrap'
import Home from './home'
import NewPerson from './newPerson'
import './app.css'
import WebSocket from './WebSocket'
import ErrorMessage from './errorMessage'
import {ApolloClient} from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory'
import {resolvers} from './resolvers'
import {typeDefs} from './schema.graphql'
import { RetryLink } from "apollo-link-retry"
import { ApolloLink } from "apollo-link"
import { persistCache } from 'apollo-cache-persist';
import {loader } from 'graphql.macro'
const GET_ERROR = loader('./graphqlQueries/GET_ERROR.graphql')

function App() {
  let [client, setClient] = useState(null)
  useEffect(()=>{async function run(){
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
  // await persistCache({
  //   cache,
  //   storage: window.localStorage,
  // });
  const RetryLinker = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true
    },
    attempts: {
      max: Infinity,
      retryIf: (error, _operation) => {
        // console.log("retry if");
        // console.log(error);
        // console.log(_operation.getContext())
        // _operation.getContext().cache.writeQuery({query:GET_ERROR ,data:{error:{__typename:"Error", message: error.message}}})
        
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
  setClient(new ApolloClient({
    link: ApolloLink.from([RetryLinker, link]),
    cache: cache,
    typeDefs,
    resolvers
  }))
  
  cache.writeData({
    data: {
      selectedRace: null,
      orderBy: {
      reverse: false,
      type: "Place",
      __typename: "OrderBy"
      },
      error: {message: null}
  }})}run() },[])
  if(!client) return "Getting old cache"
  return (<>
    <ApolloProvider client={client}>
      <nav className={"navbar navbar-dark bg-dark"}>
        <Link className={"navbar-item"} to="/">Home</Link>
        <Link className={"navbar-text"} to="/ViewRace">View Race</Link>
        <Link className={"navbar-text"} to="/SignOn">Sign On</Link>
        <Link className={"navbar-text"} to="/ManageRace">Manage Race</Link>
      </nav>
      <Router style={{paddingLeft: "10%", paddingRight: "10%"}}>
        <Home path="/" />
        <ViewRace path="ViewRace"/>
        <SignOn path="/SignOn" />
        <ManageRace path="/ManageRace" />
        <NewPerson path="/NewPerson"/>
      </Router>
      <WebSocket/>
      <ErrorMessage/>
    </ApolloProvider>
    <footer style={{paddingLeft:"3%", paddingTop: "40px"}}><p style={{ borderTopStyle: "solid", borderTopWidth:"1px"}}>By Luke Stanislaus</p></footer>
  </>);
}


export default App;
