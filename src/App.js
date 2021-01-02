import './App.css';
import Client from './client/Client';

import AuthProvider from './context/AuthProvider'
import SocketProvider from './context/SocketProvider'
import { Container, Button } from 'react-bootstrap'

import { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4001";

let socket = socketIOClient(ENDPOINT, {
  // autoConnect: false,
  // reconnection: false,
  // reconnecting: false,
})

function App() {
  const [riconnetti, setRiconnetti] = useState(false)

  useEffect(() => {
    if (riconnetti) {
      socket.connect()
      setRiconnetti(false)
    }
  }, [riconnetti])

  return (

    <div className="App">
      <SocketProvider socket={socket}>
        <AuthProvider>
            <Client setRiconnetti={setRiconnetti}/>
        </AuthProvider>
      </SocketProvider>
    </div>
  );
}

export default App;