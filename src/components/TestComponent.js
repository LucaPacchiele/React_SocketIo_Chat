import React, { useState, useRef, useEffect, useReducer } from 'react'
import { Container, Tab, Nav, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import useLocalStorage from '../hooks/useLocalStorage'


function TestComponent() {
    const msgRef = useRef()
    const recipientRef = useRef()
    const [loadConv, loadAllConv, storeConv, clearStorage] = useLocalStorage('conv')


    function reducer(conversations, action) {
        switch (action.type) {
            case 'addMessageToConv':
                const { recipient, msg } = action.payload

                const newArrayConv = [...conversations]
                let newSingleConv = {
                    with: recipient,
                    msgs: [msg]
                }
                let indice = conversations.findIndex(c => {
                    if (c.with === recipient) {
                        newSingleConv = {
                            with: c.with,
                            msgs: [...c.msgs, msg]
                        }
                        return true
                    }
                })


                if (indice > -1) {
                    newArrayConv.splice(indice, 1, newSingleConv)
                    return newArrayConv
                }
                else
                    return [
                        ...newArrayConv,
                        newSingleConv
                    ]

            case 'clearConv':
                return []
            case 'loadAllConv':
                return loadAllConv()
            default:
                throw new Error();
        }
    }

    const [conv, dispatch] = useReducer(reducer, []);

    // const storeConvWith = (recipient) => {
    //     const convToStore = conv.find(c => c.with === recipient)
    //     storeConv(convToStore, recipient)
    // }


    const handleSubmit = (e) => {
        e.preventDefault()

        const recipient = recipientRef.current.value
        const msg = msgRef.current.value

        dispatch({ type: 'addMessageToConv', payload: { recipient, msg } })


        recipientRef.current.value = ""
        msgRef.current.value = ""
    }

    useEffect(() => {
       // conv.map(c => storeConv(c, c.with))
    }, [conv])


    return (
        <div>
            <Button variant="danger" onClick={() => { dispatch({ type: 'clearConv' }) }}>clear</Button>
            <Button variant="success" onClick={() => {dispatch({ type: 'loadConv' })}}>CARICA CONVERSAZIONI</Button>
            <Button variant="danger" onClick={() => clearStorage()}>CLEAR STORAGE</Button>

            <Form onSubmit={e => handleSubmit(e)} className="d-flex justify-content-between">

                <input className="inputMessage p-4 "
                    type="text" ref={recipientRef}
                    placeholder="Nome"
                    required />

                <input className="inputMessage mt-4 p-4 "
                    type="text" ref={msgRef}
                    placeholder="Messaggio"
                    required />


                <Button type="submit" variant="success" className="buttonMessage">Invia</Button>
            </Form>


            <div className="ml-4 mt-4">
                {conv ?
                    conv.map((c, index) => (
                        <div className="d-flex border" key={index}>
                            <div className="flex-grow-1"><strong>{c.with}</strong></div>
                            <div className="flex-grow-1">
                                {c.msgs.map((msg, index) => (
                                    <div key={index}>{msg}</div>
                                ))}
                            </div>
                        </div>
                    ))
                    :
                    <h4>Non ci sono messaggi</h4>
                }

            </div>
        </div >
    )
}

export default TestComponent
