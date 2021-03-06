import React, { Fragment, createRef, useRef, useState, useEffect } from 'react'
import { Container, Tab, Nav, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap'


import Moment from 'react-moment';
import moment from 'moment';


//da implementare css messaggi https://codepen.io/swards/pen/gxQmbj


export default function Messaggi({ recipient, msgs, me, setMsgSent, msgText, setMsgText, moreMessages }) {
    const revMsgs = msgs.reverse()
    const [posHeader, setPosHeader] = useState(false)
    const [lastMsgMod, setLastMsgMod] = useState("")
    const [currRecipient, setCurrRecipient] = useState("")

    const [showLoading, setShowLoading] = useState(false)
    let timer


    const init_msg = {
        from: '',
        to: '',
        body: '',
        time: '',
        read: false
    }

    const lastMessage = createRef()
    const msgBox = createRef()
    const contactHeader = createRef()

    let currMsg = { init_msg }

    const headerStyleRelative = {
        width: "100%",
        opacity: "1"
    }
    const headerStyleFixed = {
        opacity: "0.5"
    }


    useEffect(() => {




        if (msgs.length > 0) {
            setLastMsgMod(msgs[msgs.length - 1].time)
        }
    }, [msgs])


    useEffect(() => {
        console.log("TRIGGER 2")
        //msgBox.current.scrollTop = msgBox.current.scrollHeight //carica direttamente in fondo al div referenziato da msgBox

        lastMessage.current.scrollIntoView({ behavior: 'smooth' })
    }, [lastMsgMod])




    const handleSubmit = (e) => {
        e.preventDefault()

        const msg = {
            from: me,
            to: recipient,
            body: msgText,
            time: moment().toString(), //necessario convertirlo in stringa poichè verrà usato come ID del messaggio assieme a from e to
            read: false
        }

        setMsgSent({ recipient, msg })
    }

    const onScroll = (e) => {
        msgBox.current.scrollTop > contactHeader.current.clientHeight ? setPosHeader(true) : setPosHeader(false)
        if (msgs.length > 0) {
            if (msgBox.current.scrollTop < 1) {
                setShowLoading(true)
                console.log("START TIMER")
                timer = setTimeout(() => {
                    moreMessages()
                    setShowLoading(false)
                }, 2000)

            }
        }
        else setLastMsgMod("")
    }

    useEffect(() => {
        console.log("showLoading", showLoading)
        !showLoading && clearTimeout(timer)

    }, [showLoading])

    useEffect(() => {
        console.log("recipient", recipient)
        setShowLoading(false)
        clearTimeout(timer)
        lastMessage.current.scrollIntoView({ behavior: 'smooth' })

    }, [recipient])

    return (
        <div className="Messaggi d-flex flex-column w-100" style={{ height: "100vh" }} >
            <div ref={contactHeader} className="contactHeader p-4 m-0 d-flex justify-content-between"
                style={posHeader ? headerStyleFixed : headerStyleRelative}>
                {recipient}
                {showLoading && <Spinner animation="border" variant="light" className="spinnerLoadMsgs" size="sm" />}
            </div>


            <div ref={msgBox} className="MsgBox d-flex flex-column flex-grow-1 overflow-auto  " onScroll={(e) => onScroll(e)}>


                <div className="p-2 flex-grow-1 d-flex flex-column justify-content-end ">
                    {revMsgs && revMsgs.map((msg, index) => {
                        currMsg = {
                            from: msg.from,
                            to: msg.to,
                            body: msg.body,
                            time: msg.time

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
                <Form onSubmit={e => handleSubmit(e)} className="d-flex justify-content-between w-100"  >
                    <input className="inputMessage p-4 flex-grow-1 "
                        type="text" value={msgText} onChange={e => setMsgText(e.target.value)}
                        placeholder="Inserisci il messaggio..."
                        required />
                    <Button type="submit" className="buttonMessage pr-4 pl-4  ">
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                    </Button>
                </Form>

            </div>
        </div>
    )
}

