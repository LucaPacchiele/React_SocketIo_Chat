import React, { useEffect, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useAuth } from "../context/AuthProvider";
import { useSocket } from "../context/SocketProvider";

export default function Login({ setRiconnetti }) {
    const { user, signin, signout } = useAuth()
    const { socketInfo } = useSocket()
    const { socketStatus, socketId } = socketInfo
    const idRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault()
        signin(idRef.current.value)
        idRef.current.value = ""
    }

    return (
        <div className="Login d-flex justify-content-end align-items-center p-2">

            {socketStatus === "Connesso" && <h5 className="mr-5" style={{ color: "darkgreen" }}>{socketId}</h5>}

            {socketStatus === "Non connesso" &&

                <Button variant="warning" className="mr-5" onClick={() => {
                    setRiconnetti(true)
                    // idRef.current.value && signin(idRef.current.value)
                }}>
                    Connetti al server</Button>}

            {!user.name ?
                <Form onSubmit={(e) => handleSubmit(e)} className="d-flex align-items-center">
                    <Form.Control type="text" required ref={idRef} placeholder="Inserisci ID" />
                    <Button type="submit" variant="primary" className="ml-2">Login</Button>
                    <Button type="submit" variant="secondary" className="ml-2">Nuovo</Button>
                </Form>
                :
                <>
                    <h4 className="mr-4">
                        {user.name && user.name}
                    </h4>
                    <Button type="submit" variant="primary" onClick={() => { signout() }}>Logout</Button>
                </>
            }
        </div>
    )
}
