import React, { useRef, useState } from 'react'
import { Container, Nav, Button } from 'react-bootstrap'

import Conversazioni from '../components/Conversazioni'
import { useAuth } from "../context/AuthProvider";
import { useHistory } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";


export default function Client() {
    const [activePanel, setActivePanel] = useState("conversazioni")
    const { user, signout } = useAuth()
    const { socketInfo } = useSocket()
    const { socketId } = socketInfo
    let history = useHistory();

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

                <div className="d-flex justify-content-between align-items-center p-2">
                    <h6 className="mr-5" style={{color:"#558855"}}>{socketId}</h6>
                    <div className="d-flex">
                        <h3 className="mr-4">{user.name}</h3>
                        <Button type="submit" variant="primary" onClick={() => {
                            history.push("/login");
                            signout()
                        }}>Logout</Button>
                    </div>
                </div>

                <Nav className="justify-content-center">
                    <Nav.Item>
                        <Nav.Link eventKey="contatti" onClick={() => { setActivePanel("contatti") }}>Contatti</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="conversazioni" onClick={() => { setActivePanel("conversazioni") }}>Conversazioni</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Container className="h-100">
                    {user.name && renderPanel()}
                </Container>

            </Container>
        </>
    )
}
