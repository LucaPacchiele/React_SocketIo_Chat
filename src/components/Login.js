import React, { useEffect, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useHistory } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import { useSocket } from "../context/SocketProvider";

export default function Login() {
    const { user, signin, signout } = useAuth()
    const { socketInfo } = useSocket()
    const { socketStatus, socketId } = socketInfo
    const idRef = useRef()

    let history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault()
        // qui potrebbe avvenire il controllo nella tabella user ???
        // if (username === "team5" && password === "123") {
        signin(idRef.current.value)
        history.push("/main")
        idRef.current.value = ""
        //}

    }

    return (
        <div>
            <div className="Login d-flex justify-content-end align-items-center p-2">


                <Form onSubmit={(e) => handleSubmit(e)} className="d-flex align-items-center">


                    <Form.Control type="text" required ref={idRef}
                        placeholder="Inserisci ID" />
                    <Button type="submit" variant="primary" className="ml-2">Login</Button>

                    <Button type="submit" variant="secondary" className="ml-2">Nuovo</Button>
                </Form>
                <>
                    <h4 className="mr-4">

                    </h4>
                </>

            </div>
            <div className="text-right mt-2" >
                {socketStatus === "Connesso" && <h5 className="mr-5" style={{ color: "darkgreen" }}>{socketId}</h5>}
            </div>
        </div >
    )
}
