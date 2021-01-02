import React, { Fragment, createRef, useRef, useState, useEffect } from 'react'
import { Container, Tab, Nav, Form, Button, Row, Col } from 'react-bootstrap'
import { useSocket } from "../context/SocketProvider";


import Moment from 'react-moment';
import moment from 'moment';

//da implementare css messaggi https://codepen.io/swards/pen/gxQmbj

const MINE = true   //indica messaggi inviati
const YOURS = false //indicaconst { socket } = useSocket() messaggi ricevuti

export default function Messaggi({ messaggi, setMessaggi, me, recipient }) {
    const { socket } = useSocket()

    const init_msg = {
        from: '',
        to: '',
        body: '',
        time: ''
    }

    const msgRef = useRef()
    const lastMessage = createRef()
    let lastMsg = { init_msg }

    useEffect(() => {

        socket.on('msgIn', (msg) => {
            console.log("in entrata", msg)
            setMessaggi(prevState => {
                return [...prevState, msg]
            })
        });

    }, [])


    useEffect(() => {
        lastMessage.current.scrollIntoView({ behavior: 'smooth' })
    }, [messaggi]
    )

    const handleSubmit = (e) => {
        e.preventDefault()

        const msg = {
            from: me,
            to: recipient,
            body: msgRef.current.value,
            time: moment()
        }
        setMessaggi(prevState => {
            return [...prevState, msg]
        })

        socket.emit("msgOut", msg)
        console.log("in uscita ", msg)

        msgRef.current.value = ""
    }


    return (
        <Row className="bggreen d-flex flex-column h-100">
            <div className="p-3 flex-grow-1
                justify-content-end
                overflow-auto" style={{ height: "20vh" }}>
                I miei messaggi con {recipient}

                {messaggi.map((msg, index) => {
                    lastMsg = {
                        from: msg.from,
                        to: msg.to,
                        body: msg.body,
                        time: msg.time
                    }
                    return (
                        <Fragment key={index}>
                            {lastMsg.from === me ?
                                <div className="mine message" >
                                    {msg.body}
                                </div>
                                :
                                <div className="yours message">
                                    {msg.body}
                                </div>
                            }
                        </Fragment>
                    )
                }
                )}


                <div ref={lastMessage}>
                    <Moment date={lastMsg.time}
                        className={lastMsg.from === me ? "small-text d-flex justify-content-end" : "small-text d-flex justify-content-start"}
                        format="HH:mm:ss - DD-MM-YYYY"
                    />
                </div>

            </div>
            <div className="">
                <Form onSubmit={e => handleSubmit(e)} className="d-flex">
                    <Form.Control className="p-4"
                        type="text" ref={msgRef}
                        placeholder="Inserisci il messaggio..."
                        required />
                    <Button type="submit" variant="success">Invia</Button>
                </Form>
            </div>
        </Row>
    )
}
