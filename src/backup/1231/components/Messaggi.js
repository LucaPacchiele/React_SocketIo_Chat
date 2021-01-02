import React from 'react'
import { Container } from 'react-bootstrap'


export default function Messaggi({recipient}) {
    
    const msgRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(msgRef.current.value)
        msgRef.current.value = ""
    }

    return (
        <div className="Messaggi overflow-auto flex-grow-1">
            <Container>
                I miei messaggi con {recipient}

                <div className="msgBox d-flex flex-column flex-grow-1 justify-content-end">
                    <Form onSubmit={e => handleSubmit(e)} className="d-flex">
                        <Form.Control className="d-flex" type="text" ref={msgRef} placeholder="Inserisci il messaggio..." required />
                        <Button type="submit" variant="success">Invia</Button>
                    </Form>
                </div>

            </Container>
        </div>
    )
}

