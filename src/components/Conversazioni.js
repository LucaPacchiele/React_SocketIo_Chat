import React, { useState, useEffect, useReducer } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useAuth } from "../context/AuthProvider";



import useLocalStorage from '../hooks/useLocalStorage'

import UtentiOnline from './UtentiOnline'
import Messaggi from './Messaggi'


function Conversazioni() {
    const { user } = useAuth()
    const [recipient, setRecipient] = useState('')
    const [totUsers, setTotUsers] = useState(0)
    

    const [loadValue, saveValue] = useLocalStorage('conv')

    const [messaggi, setMessaggi] = useState([])

    const init_conv = {
        me: user.name,
        with: recipient,
        messaggi
    }

    const reducer = (conv, action) => {
        switch (action.type) {
            case 'updateName':
                return {
                    ...conv,
                    me: action.name
                }
            case 'changeConvWith':
                const c = loadValue(action.recipient)
                c ? setMessaggi(c.messaggi) : setMessaggi([])
                return {
                    ...conv,
                    with: action.recipient,
                    messaggi
                }

            case 'updateMessages':
                return {
                    ...conv,
                    messaggi
                }

            default:
                throw new Error();

        }
    }

    const [conversation, dispatch] = useReducer(reducer, init_conv);



    useEffect(() => {
        dispatch({ type: 'updateName', name: user.name })
    }, [user])

    useEffect(() => {
        dispatch({ type: 'changeConvWith', recipient })
    }, [recipient])

    useEffect(() => {
        dispatch({ type: 'updateMessages' })
    }, [messaggi])

    useEffect(() => {
        saveValue(recipient, conversation)
    }, [conversation])

    useEffect(() => {
        console.log("totUsers", totUsers)
    }, [totUsers])

    
    return (

        <>
            <Row className="bgred h-100">
                <Col sm={3}>
                    <UtentiOnline recipient={recipient} setRecipient={setRecipient} setTotUsers={setTotUsers}/>
                </Col>
                <Col sm={9} className="bgblue">
                    {totUsers>0 ?
                        <Messaggi messaggi={messaggi} setMessaggi={setMessaggi} me={user.name} recipient={recipient}/>
                        :
                        <div>Seleziona un contatto</div>
                     } 
                </Col>
            </Row>
        </>

    )
}

export default Conversazioni
