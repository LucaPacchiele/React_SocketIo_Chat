import React, { useState, useEffect, useReducer, useRef, useCallback } from 'react'
import { Container, Button, Alert, Row, Col } from 'react-bootstrap'

import { useAuth } from "../context/AuthProvider";
import { useSocket } from "../context/SocketProvider";



import useLocalStorage from '../hooks/useLocalStorage'
import useWindowsSize from '../hooks/useWindowsSize'

import ListaUtentiOnline from './ListaUtentiOnline'
import Messaggi from './Messaggi'
import UserActions from './UserActions'

import logo from "../assets/img/chat2.svg"


function Conversazioni() {

    const { user } = useAuth()
    const { socket } = useSocket()
    const { size } = useWindowsSize()
    const { loadSingleConv, loadConv, loadAllConv, storeConv, storeMessageToConv } = useLocalStorage("conv-" + user.name)

    const [showAlert, setShowAlert] = useState(false);
    const [msgFrom, setMsgFrom] = useState("");
    const [msgIn, setMsgIn] = useState("");
    const [msgReadIn, setMsgReadIn] = useState("");
    const [userDisconnected, setUserDisconnected] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([])
    const [recipient, setRecipient] = useState('')
    const [currMsgs, setCurrMsgs] = useState([])
    const NUM_MSGS_TO_RENDER = 10
    const [maxMsgsRender, setMaxMsgsRender] = useState(NUM_MSGS_TO_RENDER);
    const [msgSent, setMsgSent] = useState("");
    const [msgText, setMsgText] = useState("")
    const [searchValue, setSearchValue] = useState("")

    const searchRef = useRef()

    function reducer(conversation, action) {
        let newConv, newSingleConv, indice, rec, msg, loadedConv
        switch (action.type) {

            case 'addMessageToConv':
                rec = action.payload.rec
                msg = action.payload.msg

                newConv = {
                    with: rec,
                    msgs: [...conversation.msgs, msg]
                }

                //aggiorno la conversazione corrente

                return newConv
                break


            case 'setSentMsgsRead':
                const { fromUser } = action.payload

                const newMsgs = [...conversation.msgs].map(m => {
                    if (m.from === user.name) {
                        return {
                            ...m,
                            read: true
                        }
                    }
                    else {
                        return {
                            ...m
                        }
                    }
                })

                newConv = {
                    with: conversation.with,
                    msgs: newMsgs //contiene tutti i messaggi letti
                }

                // ... salvo la specifica converazione nel DB
                storeConv(newConv, fromUser)

                // ... aggiorno lo stato 
                return newConv
                break


            //contrassegna i messaggi ricevuti come letti e invia una notifica al server al termine, comunicando che
            //l'utente ha letto tutti i messaggi con quell'utente
            case 'setReceivedMsgsRead':
                rec = action.payload.rec

                const readMsgs = [...conversation.msgs].map(m => {
                    let msgToRead = { ...m }



                    //imposto letti solo i messaggi ricevuti ..
                    if (m.from === rec) {
                        //..che non sono ancora stati letti
                        if (!m.read) {
                            msgToRead = {
                                ...m,
                                read: true
                            }
                        }
                    }
                    return msgToRead
                })

                //ho impostato letti i messaggi ricevuti da with
                socket.emit("msgAllReadOut", { fromUser: user.name, withUser: rec })

                newConv = {
                    ...conversation,
                    msgs: readMsgs
                }

                // ... salvo la specifica converazione nel DB
                storeConv(newConv, rec)

                // ... aggiorno lo stato
                return newConv
                break

            // case 'OLDloadConv':
            //     const onUsers = action.payload
            //     newConv = [...conversations]

            //     let newUserIndexArr = []

            //     // console.log("conversations", conversations)
            //     // console.log("onUsers", onUsers)

            //     onUsers.forEach((u, index) => {
            //         //se non trovo l'utente online tra le conversazioni caricate

            //         if (!conversations.find(c => {
            //             //console.log("!", u.userName, c.with)
            //             if (u.userName === conversation.with) return true
            //             else return false

            //         }))
            //             //allora è nuovo e devo...
            //             newUserIndexArr.push(index)
            //     })
            //     console.log("newUserIndexArr", newUserIndexArr)

            //     newUserIndexArr.map(newUserIndex => {
            //         //...caricare la conversazione dal DB
            //         const currNewUsername = onUsers[newUserIndex]
            //         const c = loadSingleConv(currNewUsername)
            //         if (c)
            //             newConv = [...newConv, c]
            //         else {
            //             currNewUsername && storeConv({ with: currNewUsername, msgs: [] }, currNewUsername)
            //             newConv = [...newConv, { with: currNewUsername, msgs: [] }]
            //         }
            //     })
            //     return newConv
            //     break
            // case 'removeConv':
            //     const userToRemove = action.payload
            //     newConv = [...conversations]
            //     newConv.splice(newConv.findIndex(c => (c.with === userToRemove)), 1)
            //     return newConv
            //     break

            case 'loadConv':

                rec = action.payload.rec

                //quando cambio l'utente con cui chattare carico
                loadedConv = loadSingleConv(rec)
                //trovo e carico la conversazione dal DB
                if (loadedConv) {
                    //  recipient && dispatch({ type: 'setReceivedMsgsRead', payload: { recipient } })
                    return loadedConv
                }
                else { //carico una conversazione vuota e preparo il DB

                    return { with: rec, msgs: [] }
                }


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

    const [conv, dispatch] = useReducer(reducer, { with: '', msgs: [] });



    /* TODO LETTURA MESSAGGI E CONTROLLO CHE AVVIENE TUTTO OK NEL DB */

    useEffect(() => {
        setMsgText("")

        // faccio una chiamata al server appena carico il componente ...
        socket.emit("getOnlineUsers", user.name, (res) => {
            setOnlineUsers(Array.from(JSON.parse(res.data)))
        })

        //quando arriva un messaggio aggiorno stato e il db
        socket.on('msgIn', (msg) => {
            setMsgFrom(msg.from)
            setMsgIn(msg)
        })

        socket.on('msgAllReadIn', ({ fromUser, withUser }) => {
            setMsgReadIn({ fromUser, withUser })
            //qui devo distinguere conversazione attiva e non attiva, come quando arriva un messaggio
            //dispatch({ type: 'setSentMsgsRead', payload: { fromUser, withUser } })
        })

        socket.on('client_logout', (name) => {
            console.log(name, " ha abbandonato")
            setUserDisconnected(name)
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

    useEffect(() => {
        if (msgSent) {

            const { recipient, msg } = msgSent
            if (msg) {

                dispatch({ type: 'addMessageToConv', payload: { rec: recipient, msg } })

                socket.emit("msgOut", msg)
                storeMessageToConv(msg, msg.to)

                setMsgText("")
            }
        }

    }, [msgSent])


    useEffect(() => {
        //al variare degli onlineUsers carico le conversazioni dal DB con gli utenti attualmente connessi
        //dispatch({ type: 'loadConv', payload: onlineUsers })

    }, [onlineUsers])


    useEffect(() => {
        msgFrom !== recipient ? setShowAlert(true) : setShowAlert(false)
    }, [msgFrom])

    useEffect(() => {
        if (msgIn) {

            //se mittente msg.from è il recipient attuale
            if (msgIn.from === recipient) {

                // allora devo aggiornare lo stato
                dispatch({ type: 'addMessageToConv', payload: { rec: recipient, msg: msgIn } })
                dispatch({ type: 'setReceivedMsgsRead', payload: { rec: recipient } })

            }

            storeMessageToConv(msgIn, msgIn.from)
            setMsgIn("")
        }

    }, [msgIn])

    useEffect(() => {
        if (msgReadIn) {

            const { fromUser } = msgReadIn

            //fromUser ha letto tutti i miei messaggi.
            //se mittente msg.from è il recipient attuale
            if (msgReadIn.fromUser === recipient) {
                //La conversazione è già in memoria nello stato con lui e imposto i miei messaggi letti (quelli da me inviati) e salvo la conversazione
                //aggiorno lo stato
                dispatch({ type: 'setSentMsgsRead', payload: { fromUser } })
            }
            else {
                //Carico la conversazione con lui e imposto i miei messaggi letti (quelli da me inviati) e salvo la conversazione
                //non aggiorno lo stato
                const loadedConv = loadSingleConv(fromUser)
                let newConv //conterrà i messaggi letti
                if (loadedConv) {
                    const newMsgs = [...loadedConv.msgs].map(m => {
                        if (m.from === user.name) {
                            return {
                                ...m,
                                read: true
                            }
                        }
                        else {
                            return {
                                ...m
                            }
                        }
                    })
                    newConv = {
                        with: loadedConv.with,
                        msgs: newMsgs //contiene tutti i messaggi letti
                    }
                    storeConv(newConv, fromUser)
                }
            }
            setMsgIn("")
        }
    }, [msgReadIn])

    useEffect(() => {
        //se il recipient corrente ha effettuato il logout imposto il suo valore come vuoto,
        // in modo che non viene renderizzata la chat
        recipient === userDisconnected && setRecipient('')
        setUserDisconnected("")
        //    dispatch({ type: 'removeConv', payload: { userDisconnected } })
    }, [userDisconnected])

    useEffect(() => {
        msgFrom === recipient && setShowAlert(false)

        if (recipient) {
            dispatch({ type: 'loadConv', payload: { rec: recipient } })

            //console.log("setReceivedMsgsRead",recipient )
            dispatch({ type: 'setReceivedMsgsRead', payload: { rec: recipient } })
        }

        setMsgText("")
        setMaxMsgsRender(NUM_MSGS_TO_RENDER)

    }, [recipient])


    const moreMessages = () => {
        setMaxMsgsRender(prevState => prevState + NUM_MSGS_TO_RENDER)
    }

    useEffect(() => {
        //console.log("conv.msgs", conv.msgs)
        //   console.log("CONV ", conv, "recipient", recipient)

        //ogni volta passo solo gli ultimi MAX_MSGS messaggi al componente Messaggi
        setCurrMsgs(prevState => {
            const start = conv.msgs.length - maxMsgsRender > 0 ? conv.msgs.length - maxMsgsRender : 0
            const end = conv.msgs.length
            let cutArr = conv.msgs.slice(start, end)
            return cutArr
        })

    }, [conv])

    useEffect(() => {
        setCurrMsgs(prevState => {
            const start = conv.msgs.length - maxMsgsRender > 0 ? conv.msgs.length - maxMsgsRender : 0
            const end = conv.msgs.length
            let cutArr = conv.msgs.slice(start, end)
            return cutArr
        })
    }, [maxMsgsRender])


    /* PROVA CON REF E VAI AVANTI CON RESPONSIVE*/
    let stylePanelRight = { display: "flex" }

    useEffect(() => {
        const [width, height] = size;
        console.log("DIME", width, height)
        if (width < 576) {
            stylePanelRight = {
                dispay: "none"
            }
        }
        else {
            stylePanelRight = {
                dispay: "flex"
            }
        }
    }, [size])

return (

    <>
        {showAlert && <div className="alertPopup" onClick={() => setShowAlert(false)}>Nuovo messaggio da <strong>{msgFrom}</strong></div>}

        <Row className="d-flex flex-row m-0 p-0" style={{ height: "100vh" }}>

            <Col sm={4} md={4} lg={3} id="panelLeft" className="m-0 p-0 d-flex flex-column " style={{ height: "100vh" }}>

                <div className="UserActions d-flex flex-row mt-2 mb-2 p-2 justify-content-center align-content-center" >
                    <UserActions searchValue={searchValue} setSearchValue={setSearchValue} searchRef={searchRef} />
                </div>

                <div className="m-0 p-0 d-flex flex-column flex-grow-1 overflow-auto ">
                    <ListaUtentiOnline
                        recipient={recipient}
                        setRecipient={setRecipient}
                        onlineUsers={onlineUsers}
                        conv={conv}
                        searchValue={searchValue} setSearchValue={setSearchValue}
                        searchRef={searchRef}
                    />
                </div>
            </Col>

            <Col sm={8} md={8} lg={9} id="panelRight" className="m-0 p-0 flex-column flex-grow-1 bgblue " style={stylePanelRight}>
                {onlineUsers ?
                    <>
                        {recipient ?
                            <Messaggi
                                recipient={recipient}
                                msgs={currMsgs.length > 0 ? currMsgs : []}
                                me={user.name}
                                setMsgSent={setMsgSent}
                                msgText={msgText}
                                setMsgText={setMsgText}
                                dispatch={dispatch}
                                moreMessages={moreMessages}
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
            </Col>
        </Row>
    </>

)
}

export default Conversazioni
