import React, { useRef, useState } from 'react'
import { Container, Tab, Nav, Form, Button } from 'react-bootstrap'
import Messaggi from '../components/Messaggi'
import UtentiOnline from '../components/UtentiOnline'

export default function Client() {
    const [activePanel, setActivePanel] = useState("online")
    const msgRef = useRef()
    const panelRef = useRef()


    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(msgRef.current.value)
        msgRef.current.value = ""
    }

    const renderPanel = () => {
        switch (activePanel) {
            case "contatti":
                return "I miei contatti"
            case "online":
                return <UtentiOnline />
            case "conversazioni":
                return "Le mie conversazioni"
            default:
                return "Le mie conversazioni"
        }
    }

    return (
        <div className="Client d-flex">
            <div className="d-flex flex-column">
                <Container>
                    <Nav className="justify-content-center">
                        <Nav.Item>
                            <Nav.Link eventKey="contatti" onClick={() => { setActivePanel("contatti") }}>Contatti</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="online" onClick={() => { setActivePanel("online") }}>Online</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="conversazioni" onClick={() => { setActivePanel("conversazioni") }}>Conversazioni</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <div className="p-2">
                        {renderPanel()}
                    </div>
                </Container>
            </div>

            <div className="msgBox d-flex flex-column flex-grow-1 justify-content-end">
                <Messaggi />
                <Form onSubmit={e => handleSubmit(e)} className="d-flex">
                    <Form.Control className="d-flex" type="text" ref={msgRef} placeholder="Inserisci il messaggio..." required />
                    <Button type="submit" variant="success">Invia</Button>
                </Form>
            </div>
        </div>
    )
}
