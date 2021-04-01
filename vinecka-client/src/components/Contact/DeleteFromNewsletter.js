import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

export default () => {
    const [email, setEmail] = useState('')
    const [removed, setRemoved] = useState(false)
    const [failed, setFailed] = useState(false)

    const removeEmail = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/mails/delete-from-newsletter`, {email})
            .then(res => {
                setRemoved(true)
                setTimeout(() => setRemoved(false), 3000)
            })
            .catch(err => {
                setFailed(true)
                setTimeout(() => setFailed(false), 5000)
            })
    }

    return (
        <div className="whitesmoke-bg-pnine">
            <Container className="py-4">
                <Form className="contact-form" onSubmit={removeEmail}>
                    <Row className="justify-content-center text-center mt-2">
                        <Col md={10}>
                            <label htmlFor="email">Zadajte váš e-mail a potvrdením bude odhlásený z odberu Newslettera a v prípade, že nieste u nás registrovaný, bude aj kompletne vymazaný z našej databázy.</label>
                            <input 
                                className="form-control text-center"
                                type="text" 
                                name="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Col>
                    </Row>
                    {removed &&
                    <Row className="justify-content-center text-center mt-2">
                        <Col md={10}> 
                            <Alert variant="success">
                                Váš email bol úspešne odhlásený z odberu Newslettera.
                            </Alert>
                        </Col>
                    </Row>}
                    {failed &&
                    <Row className="justify-content-center text-center mt-2">
                        <Col md={10}> 
                            <Alert variant="danger">
                                Nepodarilo sa odstrániť email, skúste to neskôr znovu, alebo nás priamo. Kontaktný formulár nájdete pod záložkou <Link to="/kontakt">Kontakt</Link>.
                            </Alert>
                        </Col>
                    </Row>}
                    {(!email) &&
                    <Row className="justify-content-center text-center mt-2">
                        <Col>  
                            <input className="btn btn-dark" type="submit" value="Odhlásiť" disabled />
                        </Col>
                    </Row>
                    }
                    {!failed && !removed && email &&
                    <Row className="justify-content-center text-center mt-2">
                        <Col>  
                            <input className="btn btn-dark" type="submit" value="Odhlásiť" />
                        </Col>
                    </Row>}
                </Form>
            </Container>
        </div>
    )
}