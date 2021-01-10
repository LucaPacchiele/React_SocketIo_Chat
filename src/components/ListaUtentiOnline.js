import React, { useEffect, useState } from 'react'
import { Nav, Alert, Row, Col, Badge } from 'react-bootstrap'



export default function ListaUtentiOnline({ recipient, setRecipient, onlineUsers, conv }) {

    const totMsgs = (name) => {
        const c = conv.find(e => e.with === name)
        if (c)
        return c.msgs.length
        else return 0
    }

    return (
        <Row id="UtentiOnline" className="d-flex flex-column h-100">
            <div>Utenti online: {onlineUsers.length}</div>
            <div className="flex-grow-1 justify-content-end overflow-auto" style={{ height: "10vh" }}>

                {onlineUsers.map((el, index) => (
                    <div key={index} className={recipient === el.userName ?
                        "contactLink contactActive d-flex justify-content-between" :
                        "contactLink d-flex justify-content-between"}
                        onClick={() => { setRecipient(el.userName) }}>
                        <div>{el.userName}</div>
                        <div><Badge variant="light">{totMsgs(el.userName)}</Badge></div>
                    </div>
                ))}
            </div>
        </Row>
    )
}
