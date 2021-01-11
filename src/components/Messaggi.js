import React, { Fragment, createRef, useRef, useState, useEffect } from 'react'
import { Container, Tab, Nav, Form, Button, Row, Col, Alert } from 'react-bootstrap'


import Moment from 'react-moment';
import moment from 'moment';

//da implementare css messaggi https://codepen.io/swards/pen/gxQmbj


export default function Messaggi({ recipient, msgs, me, spedisciMessaggio }) {


    const init_msg = {
        from: '',
        to: '',
        body: '',
        time: '',
        read: false
    }

    const msgRef = useRef()
    const lastMessage = createRef()
    let currMsg = { init_msg }



    useEffect(() => {
        lastMessage.current.scrollIntoView({ behavior: 'smooth' })
    }, [msgs]
    )

    const handleSubmit = (e) => {
        e.preventDefault()

        const msg = {
            from: me,
            to: recipient,
            body: msgRef.current.value,
            time: moment().toString(), //necessario convertirlo in stringa poichè verrà usato come ID del messaggio assieme a from e to
            read: false
        }

        spedisciMessaggio(recipient, msg)

        msgRef.current.value = ""
    }


    return (
        <Row className="Messaggi d-flex flex-column h-100">
            <div className="flex-grow-1 justify-content-end overflow-auto" style={{ height: "20vh" }}>
                <div className="contactHeader p-4 m-0">
                    <h2>{recipient}</h2>
                </div>
                <div className="p-2">
                    {msgs.map((msg, index) => {
                        currMsg = {
                            from: msg.from,
                            to: msg.to,
                            body: msg.body,
                            time: msg.time,
                            read: msg.read
                        }
                        return (
                            <div key={index} className={currMsg.from === me ? "d-flex justify-content-end" : "d-flex justify-content-start"}>
                                {currMsg.from === me ?
                                    <div className="mine message d-flex justify-content-between align-items-center" >
                                        <div>{msg.body}</div>
                                        {msg.read && <i className="fa fa-check checkReadIcon ml-2"></i>}
                                    </div>
                                    :
                                    <div className="yours message ">
                                        {msg.body}
                                    </div>
                                }
                            </div>
                        )
                    }
                    )}

                </div>

                <div ref={lastMessage}>
                    <Moment date={currMsg.time} //in questo momento currMsg è l'ultimo messaggio
                        className={currMsg.from === me ? "small-text d-flex justify-content-end" : "small-text d-flex justify-content-start"}
                        format="HH:mm:ss - DD-MM-YYYY"
                    />
                </div>


            </div>
            <div className="">
                <Form onSubmit={e => handleSubmit(e)} className="d-flex justify-content-between">
                    <input className="inputMessage p-4 flex-grow-1"
                        type="text" ref={msgRef}
                        placeholder="Inserisci il messaggio..."
                        required />
                    <Button type="submit" className="buttonMessage pr-4 pl-4">
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                    </Button>
                </Form>
            </div>
        </Row>
    )
}

