import './App.css';
import Client from './client/Client';
import Login from './components/Login';
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

          <Container className="p-0 d-flex flex-column border" style={{ height: "100vh" }}>

            <Login setRiconnetti={setRiconnetti} />

            <Client />

          </Container>

        </AuthProvider>
      </SocketProvider>
    </div>
  );
}

export default App;