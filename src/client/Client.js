import React, { useState, useEffect } from 'react'
import { Container, Nav, Button, Row, Col } from 'react-bootstrap'
import { useAuth } from "../context/AuthProvider";
import Conversazioni from '../components/Conversazioni'

import { useSocket } from "../context/SocketProvider";




export default function Client() {
    const { user } = useAuth()

    const [activePanel, setActivePanel] = useState("conversazioni")
    const { socketInfo } = useSocket()
    const { socketId } = socketInfo


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
        
            
                {/* <Nav className="justify-content-center">
                    <Nav.Item>
                        <Nav.Link eventKey="contatti" onClick={() => { setActivePanel("contatti") }}>
                            Contatti
                            </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="conversazioni" onClick={() => { setActivePanel("conversazioni") }}>
                            Conversazioni
                        </Nav.Link>
                    </Nav.Item>
                </Nav> */}

              
                    {/* {user.name && renderPanel()} */}
                    {user.name && <Conversazioni />}


        </>
    )
}
