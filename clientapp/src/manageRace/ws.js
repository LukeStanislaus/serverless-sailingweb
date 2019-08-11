import React, { useState, useEffect } from 'react'
import { withApollo } from 'react-apollo'
import useWebSocket from 'react-use-websocket'
import { AwesomeButton } from 'react-awesome-button'

const CONNECTION_STATUS_CONNECTING = 0;
const CONNECTION_STATUS_OPEN = 1;
const CONNECTION_STATUS_CLOSING = 2;
const CONNECTION_STATUS_CLOSED = 3;

function X({eventId}) {
  let socketUrl = "ws://localhost:8080"
  const [sendMessage, lastMessage, readyState] = useWebSocket(socketUrl);
  useEffect(() => {
    if (lastMessage !== null && lastMessage.data.eventId == eventId) {
      console.log(lastMessage.data)
    }
  }, [lastMessage]);
  const connectionStatus = {
    [CONNECTION_STATUS_CONNECTING]: 'Connecting',
    [CONNECTION_STATUS_OPEN]: 'Open',
    [CONNECTION_STATUS_CLOSING]: 'Closing',
    [CONNECTION_STATUS_CLOSED]: 'Closed',
  }[readyState];

  //client.writeQuery()
  return (sendMessage) => <div/>
}
export const Ws = withApollo(X)