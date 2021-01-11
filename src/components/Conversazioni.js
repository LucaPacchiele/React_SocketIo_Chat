import React, { useState, useEffect, useReducer } from 'react'
import { Container, Button, Alert, Row, Col } from 'react-bootstrap'

import { useAuth } from "../context/AuthProvider";
import { useSocket } from "../context/SocketProvider";



import useLocalStorage from '../hooks/useLocalStorage'

import ListaUtentiOnline from './ListaUtentiOnline'
import Messaggi from './Messaggi'
import UserActions from './UserActions'

import logo from "../assets/img/chat2.svg"


function Conversazioni() {

    const { user } = useAuth()
    const { socket } = useSocket()

    const [showAlert, setShowAlert] = useState(false);
    const [msgFrom, setMsgFrom] = useState("");
    const [msgIn, setMsgIn] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([])
    const [loadSingleConv, loadConv, loadAllConv, storeConv] = useLocalStorage("conv-" + user.name)
    const [recipient, setRecipient] = useState('')
    const [currConv, setCurrConv] = useState({ with: '', msgs: [] })

    function reducer(conversations, action) {
        let newConv, newSingleConv, indice
        switch (action.type) {
            //aggiungo il messaggio nell'array di messaggi di quella conversazione...
            case 'addMessageToConv':
                const { recipient: rec } = action.payload
                let { msg } = action.payload
                newConv = [...conversations]
                newSingleConv = {
                    with: rec,
                    msgs: [msg]
                }
                indice = conversations.findIndex(c => {
                    if (c.with === rec) {
                        newSingleConv = {
                            with: c.with,
                            msgs: [...c.msgs, msg]
                        }
                        return true
                    }
                })

                // ... salvo la specifica converazione nel DB
                storeConv(newSingleConv, rec)

                if (rec === recipient) setCurrConv(newSingleConv) //altrimenti renderizza la nuova chat

                // ... aggiorno lo stato
                if (indice > -1) {
                    newConv.splice(indice, 1, newSingleConv)
                    return newConv
                }
                else
                    return [
                        ...newConv,
                        newSingleConv
                    ]
                break

            case 'setAllMessageRead':
                const { fromUser, withUser } = action.payload

                newConv = [...conversations]

                indice = conversations.findIndex(c => {
                    //quando ho trovato quella specifica conversazione, imposto letti tutti i messaggi
                    if (c.with === fromUser) {
                        const newMsgs = [...c.msgs].map(m => {
                            return {
                                ...m,
                                read: true
                            }
                        })

                        newSingleConv = {
                            with: c.with,
                            msgs: newMsgs //contiene tutti i messaggi letti
                        }
                        return true
                    }
                })

                // ... salvo la specifica converazione nel DB
                storeConv(newSingleConv, fromUser)

                if (fromUser === recipient) setCurrConv(newSingleConv) //altrimenti renderizza la nuova chat

                // ... aggiorno lo stato (le conversazioni)
                if (indice > -1) {
                    newConv.splice(indice, 1, newSingleConv)
                    return newConv
                }

                break


            case 'loadConv':
                const onUsers = action.payload
                newConv = [...conversations]
                onUsers.map(u => {
                    const c = loadSingleConv(u.userName)
                    if (c)
                        newConv = [...newConv, c]
                    else {
                        u.userName && storeConv({ with: u.userName, msgs: [] }, u.userName)
                        newConv = [...newConv, { with: u.userName, msgs: [] }]
                    }
                })
                return newConv
                break


            case 'makeAllReadConv':
                let { currentConv } = action.payload
                newConv = [...conversations]
                const readMsgs = [...currentConv.msgs].map(m => {
                    let msgToRead = { ...m }

                    if (!m.read) { //imposto letti solo i messaggi ricevuti ..
                        if (m.from !== user.name) {
                            msgToRead = {
                                ...m,
                                read: true
                            }
                        }
                    }
                    return msgToRead
                })

                //ho impostato letti i messaggi ricevuti da with
                socket.emit("msgAllReadOut", { fromUser: user.name, withUser: currentConv.with })

                currentConv = {
                    ...currentConv,
                    msgs: readMsgs
                }

                let index = conversations.findIndex(c => (c.with === currentConv.with))

                // ... salvo la specifica converazione nel DB
                storeConv(currentConv, currentConv.with)
                if (currentConv.with === recipient) setCurrConv(currentConv) //altrimenti renderizza la nuova chat

                // ... aggiorno lo stato
                newConv.splice(index, 1, currentConv)
                return newConv
                break
            //non utilizzate
            case 'clearConv':
                return []
                break
            case 'loadAllConv':
                return loadAllConv()
                break
            default:
                throw new Error();
                break
        }
    }

    const [conv, dispatch] = useReducer(reducer, []);



    const spedisciMessaggio = (rec, msg) => {
        dispatch({ type: 'addMessageToConv', payload: { recipient: rec, msg } })
        socket.emit("msgOut", msg)
    }

    useEffect(() => {
        // faccio una chiamata al server appena carico il componente ...
        socket.emit("getOnlineUsers", user.name, (res) => {
            setOnlineUsers(Array.from(JSON.parse(res.data)))
        })

        //quando arriva un messaggio aggiorno stato e il db
        socket.on('msgIn', (msg) => {
            setMsgFrom(msg.from)
            dispatch({ type: 'addMessageToConv', payload: { recipient: msg.from, msg } })
            setMsgIn(msg.from)
        })

        socket.on('msgAllReadIn', ({ fromUser, withUser }) => {
            console.log("msgAllReadIn", fromUser, withUser)
            dispatch({ type: 'setAllMessageRead', payload: { fromUser, withUser } })
        })

        socket.on('client_logout', (name) => {
            if (!onlineUsers.find(el => el.userName === name)) {
                setRecipient('')
            }
        })


    }, [])



    // ... la richiesta viene effettuata ogni 2 secondi per verificare se vi sono nuovi utenti connessi
    // il timer viene distrutto quando il componente non viene visualizzato più, ad esempio cambiando scheda
    // è utile per limitare le richieste, anziché impostare un timer direttamente nel provider della socket
    // che tra l'altro causerebbe problemi di renderizzazione del componente creando una nuova socket.
    // Devo usare una variabile di stato onlineUsers perchè è arincrona la chiamata al server
    useEffect(() => {
        const timerRequest = setInterval(() => {
            socket.emit("getOnlineUsers", user.name, (res) => {
                setOnlineUsers(Array.from(JSON.parse(res.data)))
            })
        }, 1000); //tempo caricamento
        return () => {
            clearInterval(timerRequest)
        }
    })

    // useEffect(() => {
    //     console.log("--> invio", msgReadToSend)
    //     setMsgReadToSend("")
    // }, [msgReadToSend])


    useEffect(() => {
        //al variare degli onlineUsers carico le conversazioni dal DB con gli utenti attualmente connessi

        dispatch({ type: 'loadConv', payload: onlineUsers })


        //se il recipient corrente ha effettuato il logout imposto il suo valore come vuoto,
        // in modo che non viene renderizzata la chat

    }, [onlineUsers])


    useEffect(() => {
        msgFrom !== recipient ? setShowAlert(true) : setShowAlert(false)

    }, [msgFrom])

    useEffect(() => {
        //se mittente msg.from è il recipient attuale
        if (msgIn === recipient) {
            // allora devo impostare quella conversazione letta e dopo inviare notifica lettura per quella conversazione
            dispatch({ type: 'makeAllReadConv', payload: { currentConv: currConv } })
        }
        setMsgIn("")
    }, [msgIn])

    useEffect(() => {
        msgFrom === recipient && setShowAlert(false)

        setCurrConv(() => {
            const singleConv = loadSingleConv(recipient)
            //trovo e carico la conversazione dal DB
            if (singleConv) {

                recipient && dispatch({ type: 'makeAllReadConv', payload: { currentConv: singleConv } })

                return singleConv
            }
            else { //carico una conversazione vuota e preparo il DB
                recipient && storeConv({ with: recipient, msgs: [] }, recipient)
                return { with: recipient, msgs: [] }
            }
        })

    }, [recipient])

    useEffect(() => {
        // console.log("CONV", currConv)
    }, [conv])

    useEffect(() => {

        console.log("currCONV", currConv)

    }, [currConv])




    // usestate variabile = messaggiLetti - msgWithRecipient  -->useEffectASDASD per aggiornarla quando cambia msgWithRecipient?
    //passa come props variabile a ListaUtentiOnline


    return (

        <>
            {showAlert && <div className="alertPopup" onClick={() => setShowAlert(false)}>Nuovo messaggio da <strong>{msgFrom}</strong></div>}

            <div className="row panelLeft m-0 p-0" style={{ height: "100vh" }}>
                <div className="col col-sm-4 col-md-4 col-lg-4">
                    <UserActions />



                    <ListaUtentiOnline
                        recipient={recipient}
                        setRecipient={setRecipient}
                        onlineUsers={onlineUsers}
                        conv={conv} />
                </div>
                <div className="col col-sm-8 col-md-8 col-lg-8 bgblue">
                    {onlineUsers ?
                        <>
                            {recipient ?
                                <Messaggi
                                    recipient={recipient}
                                    msgs={currConv ? currConv.msgs : []}
                                    me={user.name}
                                    spedisciMessaggio={spedisciMessaggio}
                                />
                                :
                                <div className="HomePage d-flex flex-column align-items-center justify-content-center h-100">
                                    {/* <i className="fa fa-comments homeIcon"></i> */}
                                    <img src={logo} className="homeIcon" />
                                    <h1 className="textShadow">Hello!</h1>
                                </div>
                            }
                        </>
                        :
                        <Alert variant="warning">Non ci sono utenti loggati oltre a te!</Alert>
                    }
                </div>
            </div>
        </>

    )
}

export default Conversazioni
