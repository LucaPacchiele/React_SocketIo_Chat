import React, { useEffect, useState } from 'react'
import { ListGroup, Alert } from 'react-bootstrap'
import { useSocket } from "../context/SocketProvider";
import { useAuth } from "../context/AuthProvider";


export default function UtentiOnline() {
    const { socket } = useSocket()
    const { user } = useAuth()
    const [onlineUsers, setOnlineUsers] = useState([])
    const [activeItem, setActiveItem] = useState()


    // faccio una chiamata al server appena carico il componente ...
    useEffect(() => {
        socket.emit("getOnlineUsers", user.name, (res) => { setOnlineUsers(Array.from(JSON.parse(res.data))) })
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
        }, 2000);
        return () => {
            clearInterval(timerRequest)
        }
    })

    //TODO inserisci badges (vedi documentazione bootstrap, non reactbootstrap) per nuovi messaggi!

    return (
        <div id="UtentiOnline">
            
            {onlineUsers.length > 0 ?
                <>
                    <div>Utenti online: {onlineUsers.length}</div>
                    <ListGroup>
                        {onlineUsers.map((el, index) => (
                            <ListGroup.Item key={index}
                                className={activeItem === index && "active"}
                                onClick={() => { setActiveItem(index) }}> {el.userName}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </>
                :

                <Alert variant="warning">Non vi sono utenti loggati oltre a te!</Alert>

            }
        </div >
    )
}
