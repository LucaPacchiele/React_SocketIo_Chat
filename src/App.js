import './App.css';
import Client from './client/Client';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute'
import ConnectedRoute from './components/ConnectedRoute'
import TestComponent from './components/TestComponent'

import AuthProvider from './context/AuthProvider'
import SocketProvider from './context/SocketProvider'
import { Container, Button } from 'react-bootstrap'

import { useState, useEffect } from 'react';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, Redirect
} from "react-router-dom";

import { createBrowserHistory } from 'history';

const history = createBrowserHistory();





/* 

TODO:
  + gestire al meglio il routing, magari da capo con i file di backup
    fare un routing in linea con sviluppi di app future

  + simulazioni chat e test scimmia su ogni caso d'uso

  + postgre: salvataggio Nuovi utenti in database
  + postgre: salvataggio messaggi e definizione generale tabelle 
  


*/



function App() {


  return (

   <>
      {/* <TestComponent /> */}
      <Router history={history}>
        <SocketProvider>
          <AuthProvider>
            <ConnectedRoute>

              <Switch>

                <Route exact path="/login">
                  <Login />
                </Route>

                <PrivateRoute path="/main">
                  <Client />
                </PrivateRoute>

                <Route path="/">
                  <Redirect to="/main" />
                </Route>

              </Switch>

            </ConnectedRoute>
          </AuthProvider>
        </SocketProvider>
      </Router>
</>
  );
}

export default App;