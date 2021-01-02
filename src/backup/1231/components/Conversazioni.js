import React from 'react'

import UtentiOnline from '../components/UtentiOnline'
import Messaggi from '../components/Messaggi'


function Conversazioni() {

    const [recipient, setRecipient] = useState()

    return (

        <>
            <Container>
                <Row>
                    <Col sm={3}>
                        <UtentiOnline recipient={recipient} setRecipient={setRecipient} />
                    </Col>
                    <Col sm={9}>
                        <Messaggi recipient={recipient} />
                    </Col>
                </Row>
            </Container>
        </>

    )
}

export default Conversazioni
