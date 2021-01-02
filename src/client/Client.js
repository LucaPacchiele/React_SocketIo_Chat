import React, { useRef, useState } from 'react'
import { Container, Nav } from 'react-bootstrap'

import Login from '../components/Login';
import Conversazioni from '../components/Conversazioni'
import { useAuth } from "../context/AuthProvider";


export default function Client({ setRiconnetti }) {
    const [activePanel, setActivePanel] = useState("conversazioni")
    const { user } = useAuth()


    const renderPanel = () => {
        switch (activePanel) {
            case "contatti":
                return "I miei contatti, da implementare"
            case "conversazioni":
                return <Conversazioni />
            default:
                return <Conversazioni />
        }
    }

    return (

        <>
            {/* Navbar Contatti / Conversazioni
            se Converazioni allora mostra Conversazioni altrimenti mostro Contatti 
            */}
            <Container className="p-0 d-flex flex-column border" style={{ height: "100vh" }}>

                <Login setRiconnetti={setRiconnetti} />

                <Nav className="justify-content-center">
                    <Nav.Item>
                        <Nav.Link eventKey="contatti" onClick={() => { setActivePanel("contatti") }}>Contatti</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="conversazioni" onClick={() => { setActivePanel("conversazioni") }}>Conversazioni</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Container className="h-100">
                    {user.name && renderPanel() }
                </Container>

            </Container>
        </>
    )
}
