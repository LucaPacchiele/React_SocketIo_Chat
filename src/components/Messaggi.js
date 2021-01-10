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
        read:false
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
            read:false
        }
        
        spedisciMessaggio(recipient, msg)

        msgRef.current.value = ""
    }


    return (
        <Row className="bggreen d-flex flex-column h-100">
            <div className="p-3 flex-grow-1 justify-content-end overflow-auto" style={{ height: "20vh" }}>
                I miei messaggi con {recipient}

                {msgs.map((msg, index) => {
                    currMsg = {
                        from: msg.from,
                        to: msg.to,
                        body: msg.body,
                        time: msg.time,
                        read: msg.read
                    }
                    return (
                        <Fragment key={index}>
                            {currMsg.from === me ?
                                <div className="mine message d-flex justify-content-between" >
                                     <div>{msg.body}</div>
                                    {msg.read && <div style={{color:"green", fontWeight:"bold"}}>v</div>}
                                </div>
                                :
                                <div className="yours message ">
                                    {msg.body}
                                </div>
                            }
                        </Fragment>
                    )
                }
                )}


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
                    <Button type="submit" variant="success" className="buttonMessage">Invia</Button>
                </Form>
            </div>
        </Row>
    )
}

