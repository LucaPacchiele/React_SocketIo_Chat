import React, { useState, useEffect } from 'react'
import { Container, Alert, Row, Col } from 'react-bootstrap'

import { useAuth } from "../context/AuthProvider";
import { useSocket } from "../context/SocketProvider";



import useLocalStorage from '../hooks/useLocalStorage'

import ListaUtentiOnline from './ListaUtentiOnline'
import Messaggi from './Messaggi'


function Conversazioni() {
    const { user } = useAuth()
    const [recipient, setRecipient] = useState('')
    const [totUsers, setTotUsers] = useState(0)

    const { socket } = useSocket()

    const [loadValue, saveValue] = useLocalStorage('conv')

    const [messaggi, setMessaggi] = useState([])
    const [msgWithRecipient, setMsgWithRecipient] = useState([])
    const [totMsgs, setTotMsgs] = useState([])
    const [readMessages, setReadMessages] = useState([])

    const [showAlert, setShowAlert] = useState(false);
    const [msgFrom, setMsgFrom] = useState("");


    useEffect(() => {
        //al caricamento del componente, carico tutti i messaggi
        const c = loadValue(user.name)
        c ? setMessaggi(c) : setMessaggi([])

        socket.on('msgIn', (msg) => {
            setMsgFrom(msg.from)
            setMessaggi(prevState => {
                return [...prevState, msg]
            })
        });
    }, [])

    useEffect(() => {
        msgFrom !== recipient ? setShowAlert(true) : setShowAlert(false)
    }, [msgFrom])

    useEffect(() => {
        const c = loadValue(user.name)
        c ? setMessaggi(c) : setMessaggi([])
        msgFrom === recipient && setShowAlert(false)
    }, [recipient])

    useEffect(() => {
        saveValue(user.name, messaggi)
        setMsgWithRecipient(() => {
            let msgs = []
            Array.from(messaggi).forEach((el) => {
                if (el.to === recipient || el.from === recipient)
                    msgs.push(el)
            })
            return msgs
        })
        return (() => setMsgWithRecipient([]))

    }, [messaggi])

    useEffect(() => {
        setTotMsgs(msgWithRecipient.length)
        console.log("msgWithRecipient", msgWithRecipient)
    }, [msgWithRecipient])

    // usestate variabile = messaggiLetti - msgWithRecipient  -->useEffect per aggiornarla quando cambia msgWithRecipient?
    //passa come props variabile a ListaUtentiOnline


    return (

        <>
            {showAlert && <div className="alertPopup" onClick={() => setShowAlert(false)}>Nuovo messaggio da <strong>{msgFrom}</strong></div>}

            <Row className="bgred h-100">
                <Col sm={3}>
                    <ListaUtentiOnline recipient={recipient} setRecipient={setRecipient}
                        setTotUsers={setTotUsers} totMsgs={totMsgs} />
                </Col>
                <Col sm={9} className="bgblue">
                    {totUsers > 0 ?
                        <>
                            {recipient ?
                                <Messaggi
                                    msgWithRecipient={msgWithRecipient}
                                    recipient={recipient}
                                    me={user.name}
                                    setMessaggi={setMessaggi}
                                />
                                :
                                <Alert variant="success">Seleziona un contatto</Alert>
                            }
                        </>
                        :
                        <Alert variant="warning">Non ci sono utenti loggati oltre a te!</Alert>
                    }
                </Col>
            </Row>
        </>

    )
}

export default Conversazioni
