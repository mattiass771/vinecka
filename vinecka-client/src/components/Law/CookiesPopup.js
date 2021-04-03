import React, {useState} from 'react'
import {Link} from 'react-router-dom'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

export default ({setShowLawPopup}) => {
    const [aknowledged, setAknowledged] = useState(localStorage.getItem('mas-vino-cookies') || '')

    const handleAcceptCookies = () => {
        localStorage.setItem('mas-vino-cookies', 'aknowledged')
        setAknowledged('aknowledged')
    }
    return (
        aknowledged !== 'aknowledged' &&
        <div className="whitesmoke-bg-pnine fixed-bottom text-center" style={{zIndex: '+99', paddingTop: '40px', paddingBottom: '40px'}}>
            <Container>
                <Row>
                    <Col>
                        Týmto by sme Vás radi oboznámili, že v prípade vyplnenia osovných údajov za účelom vytvorenia objednávky, alebo registácie nového používateľa, budú Vaše
                        údaje uložené (pre potreby predvyplnenia, či spracovania objednávok) v Cookies. Viac inforácií o tom, aké Cookies používame sa dočítate v &nbsp;
                        <Link to="" onClick={() => setShowLawPopup('gdpr')}>Ochrana osobných údajov</Link> . &nbsp;&nbsp;&nbsp; <br />
                        <Button className="mt-3" variant="dark" onClick={() => handleAcceptCookies()}>Ok, zavrieť.</Button>
                    </Col>
                </Row>
            </Container>
        </div>
)
}