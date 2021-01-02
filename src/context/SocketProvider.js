import React, {
    createContext, useState, useContext, useEffect,
    useReducer, useCallback, useMemo
} from 'react'



export const socketContext = createContext()

//shorthands per utilizzare il contesto
export function useSocket() {
    return useContext(socketContext)
}

export default function SocketProvider({ socket, children }) {

    const [socketStatus, setSocketStatus] = useState('Non connesso')
    const [socketId, setSocketId] = useState('')

    useEffect(() => {

        socket.on('connect', function () {
            console.log("connesso al server")
            setSocketStatus('Connesso')
            setSocketId(socket.id)
        });

        socket.on('disconnect', (reason) => {
            socket.disconnect()
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
        socketInfo
    }


    return (
        <socketContext.Provider value={socketValue}>
            {children}
        </socketContext.Provider>
    )
}
