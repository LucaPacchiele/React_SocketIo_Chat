import React, { useEffect, useState } from 'react'
import { Nav, Alert, Row, Col } from 'react-bootstrap'
import { useSocket } from "../context/SocketProvider";
import { useAuth } from "../context/AuthProvider";


export default function UtentiOnline({ recipient, setRecipient, setTotUsers}) {
    const { socket } = useSocket()
    const { user } = useAuth()
    const [onlineUsers, setOnlineUsers] = useState([])


    // faccio una chiamata al server appena carico il componente ...
    useEffect(() => {
        socket.emit("getOnlineUsers", user.name, (res) => { setOnlineUsers(Array.from(JSON.parse(res.data))) })
        setTotUsers(onlineUsers.length)
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
            setTotUsers(onlineUsers.length)
        }, 1000);
        return () => {
            clearInterval(timerRequest)
        }
    })

    //TODO inserisci badges (vedi documentazione bootstrap, non reactbootstrap) per nuovi messaggi!


    return (
        <>
            {onlineUsers.length > 0 ?
                <Row id="UtentiOnline" className="d-flex flex-column h-100">
                    <div>Utenti online: {onlineUsers.length}</div>
                    <div className="flex-grow-1
                justify-content-end
                overflow-auto" style={{ height: "10vh" }}>

                        {onlineUsers.map((el, index) => (
                            <div key={index} className={recipient === el.userName ? "contactLink contactActive" : "contactLink"}
                                onClick={() => { setRecipient(el.userName) }}>
                                {el.userName}
                            </div>
                        ))}
                    </div>
                </Row>
                :

                <Alert variant="warning">Non ci sono utenti loggati oltre a te!</Alert>

            }
        </>
    )
}
