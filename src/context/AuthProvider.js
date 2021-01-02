import React, { createContext, useState, useContext, useEffect, useReducer, useCallback } from 'react'
import { useCookies } from 'react-cookie'
import { useSocket } from "../context/SocketProvider";

export const authContext = createContext()

//shorthands per utilizzare il contesto
export function useAuth() {
    return useContext(authContext)
}



export default function AuthProvider({ children }) {
    const { socket, socketInfo } = useSocket()
    const { socketStatus, socketId } = socketInfo

    const [cookies, setCookie, removeCookie] = useCookies();

    const initialUser = {
        name: '',
        socketId: ''
    }
    const [emit, setEmit] = useState({ type: "welcome", user: initialUser })

    const reducer = (user, action) => {
        let newUser
        switch (action.type) {
            case 'signin':
                newUser = {
                    ...user,
                    name: action.payload,
                //    id: Math.floor(Math.random() * (100)),
                    socketId
                }
                setEmit({ type: action.type, user: newUser })       //socket.emit(action.type, newUser, (res) => console.log(res))
                return newUser
            case 'signout':
                setEmit({ type: action.type, user: user })       // socket.emit(action.type, user, (res) => console.log(res))
                newUser = {
                    ...user,
                    name: '',
                    socketId: ''
                }
                return newUser
            default:
                throw new Error();
        }
    }

    const [user, dispatch] = useReducer(reducer, initialUser);

    const signin = (usernameValue) => {
        const current = new Date()
        current.setHours(current.getHours(), current.getMinutes() + 50, current.getSeconds()); //dopo un'ora
        setCookie('user', usernameValue, { path: '/', expires: current });
        dispatch({ type: 'signin', payload: usernameValue })
    }

    const signout = () => {
        removeCookie('user')
        dispatch({ type: 'signout' })
    }

    useEffect(() => {
        if (cookies.user || user.name) {
            dispatch({ type: 'signin', payload: cookies.user })
        }
    }, [socketId])

    //invio messaggio al server al variare di emit (altrimenti fa invio doppio)
    useEffect(() => {
        socket.emit(emit.type, emit.user, (res) => console.log(res))
    }, [emit])


    const auth = {
        user,
        signin,
        signout
    }
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    )
}
