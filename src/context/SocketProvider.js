import React, {
    createContext, useState, useContext, useEffect,
    useReducer, useCallback, useMemo
} from 'react'

import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4001";
let socket = socketIOClient(ENDPOINT, {
    // autoConnect: false,
    // reconnection: false,
    // reconnecting: false,
})


export const socketContext = createContext()

//shorthands per utilizzare il contesto
export function useSocket() {
    return useContext(socketContext)
}

export default function SocketProvider({ children }) {

    const [socketStatus, setSocketStatus] = useState('Non connesso')


    const [socketId, setSocketId] = useState('')

    const [newConnection, setNewConnection] = useState(false)


    //da automatizzare con setInterval, ma genera errore non gestito se il server è spento
    useEffect(() => {
        if (newConnection) {
            socket.connect()

            setNewConnection(false)
        }
    }, [newConnection])


    useEffect(() => {

        socket.on('connect', function () {
            console.log("connesso al server")
            setSocketStatus('Connesso')

            setSocketId(socket.id)
        });

        socket.on('disconnect', (reason) => {
            socket.disconnect()
            socket.close();
            setSocketStatus('Non connesso')

            console.log(reason)
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
            }
            if (reason === 'transport close') {

            }
            // else the socket will automatically try to reconnect
        });
       
    }, [])





    const socketInfo = {
        socketStatus,
        socketId
    }


    const socketValue = {
        socket,
        socketInfo,
        setNewConnection,
    }


    return (
        <socketContext.Provider value={socketValue}>
            {children}
        </socketContext.Provider>
    )
}
