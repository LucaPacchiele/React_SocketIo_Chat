import React, { useState, useEffect } from 'react'
import { Container, Alert, Row, Col } from 'react-bootstrap'

import { useAuth } from "../context/AuthProvider";
import { useSocket } from "../context/SocketProvider";



import useLocalStorage from '../hooks/useLocalStorage'

import UtentiOnline from './UtentiOnline'
import Messaggi from './Messaggi'


function Conversazioni() {
    const { user } = useAuth()
    const [recipient, setRecipient] = useState('')
    const [totUsers, setTotUsers] = useState(0)

    const { socket } = useSocket()

    const [loadValue, saveValue] = useLocalStorage('conv')

    const [messaggi, setMessaggi] = useState([])
    const [msgWithRecipient, setMsgWithRecipient] = useState([])

    const [showAlert, setShowAlert] = useState(false);
    const [msgFrom, setMsgFrom] = useState("");


    const getNumMessagesWith = (username) => {
        let msgs = []
        if (messaggi) {
            Array.from(messaggi).forEach((el) => {
                if (el.to === username || el.from === username)
                    msgs.push(el)
            })
            return msgs.length
        }
        else return -2
    }


    useEffect(() => {
        const c = loadValue(user.name)
        c ? setMessaggi(c) : setMessaggi([])
        console.log("RENDERIZZA")

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

    }, [messaggi])


    return (

        <>
            {showAlert && <div className="alertPopup" onClick={() => setShowAlert(false)}>Nuovo messaggio da <strong>{msgFrom}</strong></div>}

            <Row className="bgred h-100">
                <Col sm={3}>
                    <UtentiOnline recipient={recipient} setRecipient={setRecipient} setTotUsers={setTotUsers} getNumMessagesWith={getNumMessagesWith} />
                </Col>
                <Col sm={9} className="bgblue">
                    {totUsers > 0 ?
                        <>
                            {recipient ?
                                <Messaggi messaggi={messaggi} setMessaggi={setMessaggi} me={user.name}
                                    recipient={recipient}
                                    msgWithRecipient={msgWithRecipient} setMsgWithRecipient={setMsgWithRecipient}
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
