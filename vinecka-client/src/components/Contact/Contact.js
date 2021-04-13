import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import emailjs from 'emailjs-com';

import Map from './Map'

import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const token = process.env.REACT_APP_API_SECRET

export default ({userId, isOwner}) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [checkedGdpr, setCheckedGdpr] = useState(false)
    const [checkedNewsletter, setCheckedNewsletter] = useState(false)
    const [showNewsMails, setShowNewsMails] = useState('')

    const sendEmail = (e) => {
        e.preventDefault();
        setSending(true)

        emailjs.sendForm('service_vjc9vdo', 'template_o2r5vl8', e.target, process.env.REACT_APP_EMAILJS_USERID)
        .then((result) => {
            if (checkedNewsletter) {
                axios.post(`${process.env.REACT_APP_BACKEND_URL}/mails/add`, {name, email, token})
                    .then(res => console.log(res))
                    .catch(err => err && console.log(err))
            }
            setSending(false)
            setName('')
            setEmail('')
            setMessage('')
            setSuccess(true)
            setTimeout(() => setSuccess(false), 2000)
        }, (error) => {
            setSending(false)
            setFailed(true)
            setTimeout(() => setFailed(false), 2000)
        });
    }

    const getNewsMails = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/mails/emails`, {token})
            .then(res => setShowNewsMails(res.data))
            .catch(err => console.log(err))
    }

  return (
    <div className="whitesmoke-bg-pnine">
        <Container className="py-4">
            {isOwner && 
            <Row className="mb-4 mt-4 text-center justify-content-center">
                <Button variant="dark" onClick={() => getNewsMails()} >Newsletter E-Maily</Button>
            </Row>
            }
            {isOwner && typeof showNewsMails === 'string' && showNewsMails.length !== 0 &&
            <Modal show={showNewsMails.length !== 0} onHide={() => setShowNewsMails('')}>
                <Modal.Body>
                        {showNewsMails}
                </Modal.Body>
                <Modal.Footer className="row justify-content-center">
                    <Button variant="dark" onClick={() => setShowNewsMails('')}>
                        Zavrieť
                    </Button>
                </Modal.Footer>
            </Modal>
            }
            <Row className="mb-4 mt-4 text-center justify-content-center">
                <div className="d-none d-md-block col-md-3"><hr style={{backgroundColor: '#2b371b', height: '1px', marginTop: '22px'}} /></div>
                <div className="col-md-6"><h1>Kontaktujte nás!</h1></div>
                <div className="d-none d-md-block col-md-3"><hr style={{backgroundColor: '#2b371b', height: '1px', marginTop: '22px'}} /></div>
            </Row>
            <Row className="mb-4 mt-4 text-center justify-content-center" style={{fontSize:"125%"}}>
                <Col xs={10}>Máte nejake otázky, alebo ste aj vy vinár/vinárstvo fungujúce v Malokarpatskej oblasti?<br /> Neváhajte a napíšte nám správu prostredníctvom formulára nižšie. Pokojne sa nám v krátkosti predstavte v správe a detaily vám následne upresníme v ďaľšej komunikácii. <br />Tešíme sa na našu budúcu spoluprácu!</Col>
            </Row>
            <Form className="contact-form" onSubmit={sendEmail}>
                <input type="hidden" name="contact_number" />
                <Row className="justify-content-center text-center mt-2">
                    <Col md={10}>
                        <label htmlFor="from_name">Meno</label>
                        <input 
                            className="form-control text-center"
                            type="text" 
                            name="from_name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row className="justify-content-center text-center mt-2">
                    <Col md={10}>
                    <label htmlFor="from_email">Email</label>
                    <input 
                        className="form-control text-center"
                        type="email" 
                        name="from_email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    </Col>
                </Row>
                <Row className="justify-content-center text-center mt-2">
                    <Col md={10}>
                    <label htmlFor="message">Správa</label>
                    <textarea 
                        className="form-control text-center"
                        style={{minHeight: "100px"}}
                        name="message" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    </Col>
                </Row>
                <Row className="justify-content-center mt-2">
                    <Col md={10}>
                    <em style={{float: 'left'}}>
                        <input 
                            style={{
                                cursor: 'pointer',
                            }}
                            type='checkbox'
                            name='checkedGdpr'
                            checked={checkedGdpr}
                            onChange={() => setCheckedGdpr(!checkedGdpr)}
                        />&nbsp;
                        Súhlasím so spracovávaním osobných údajov (v zmysle Zákona č. 18/2018 Z.z. o ochrane osobných údajov a o zmene a doplnení niektorých zákonov a zákona č. 245/2008 Z.z. o výchove a vzdelávaní v znení neskorších zmien a predpisov)</em>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-2">
                    <Col md={10}>
                    <em style={{float: 'left'}}>
                        <input 
                            style={{
                                cursor: 'pointer',
                            }}
                            type='checkbox'
                            name='checkedNewsletter'
                            checked={checkedNewsletter}
                            onChange={() => setCheckedNewsletter(!checkedNewsletter)}
                        />&nbsp;
                        Chcem odoberať newsletter a týmto súhlasím s odoberaním newslettra eshopu masvino.sk. Tento súhlas môžete odvolať, napríklad <Link to="/odhlasit-newsletter">tu</Link>, alebo na konci každého newsletter emailu.</em>
                    </Col>
                </Row>
                {success &&
                <Row className="justify-content-center text-center mt-2">
                    <Col md={10}> 
                        <Alert variant="success">
                            Váš email bol úspešne odoslaný.
                        </Alert>
                    </Col>
                </Row>}
                {failed &&
                <Row className="justify-content-center text-center mt-2">
                    <Col md={10}> 
                        <Alert variant="danger">
                            Nepodarilo sa odoslať email.
                        </Alert>
                    </Col>
                </Row>}
                {sending &&
                <Row className="justify-content-center text-center mt-2">
                    <Col md={10}> 
                        <Spinner animation="border" style={{color: 'whitesmoke'}} />
                    </Col>
                </Row>}
                {(!checkedGdpr || !name || !email || !message) &&
                <Row className="justify-content-center text-center mt-2">
                    <Col>  
                        <input className="btn btn-dark" type="submit" value="Odoslať" disabled />
                    </Col>
                </Row>
                }
                {!failed && !success && !sending && checkedGdpr && name && email && message &&
                <Row className="justify-content-center text-center mt-2">
                    <Col>  
                        <input className="btn btn-dark" type="submit" value="Odoslať" />
                    </Col>
                </Row>}
            </Form>
            <Row className="text-center text-md-left my-4" style={{fontSize: "150%"}}>
                <Col xs={12} md={{offset: 1, span: 5}}>IBAN:</Col>
                <Col xs={12} md={{span: 5}}><strong>SK21 1111 0000 0016 0902 7005</strong></Col>
                <Col xs={12} md={{offset: 1, span: 5}}>BIC/SWIFT:</Col>
                <Col xs={12} md={{span: 5}}><strong>UNCRSKBX</strong></Col>
                <Col xs={12} md={{offset: 1, span: 5}}>VARIABILNY SYMBOL:</Col>
                <Col xs={12} md={{span: 5}}><strong>ID objednávky{userId && ` (nájdete v sekcii ${<Link to="/objednavky">Objednávky</Link>})`}</strong></Col>
            </Row>
            <Row className="mb-4 mt-4 text-center justify-content-center" style={{fontSize:"125%"}}>
                <Col xs={10}>
                    <h1>Osobný odber</h1>
                    Ul. Eugena Suchoňa 24, 902 01 Pezinok. Možná dohoda, volajte na 0948 721 868.
                </Col>
            </Row>
            <Row className="mb-4 mt-4 text-center justify-content-center" style={{fontSize:"125%"}}>
                <Col xs={10}>
                    <Map 
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API}&v=3.exp&libraries=geometry,drawing,places`}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        lat={48.282411181745005}
                        lng={17.25283474894052}
                    />
                </Col>
            </Row>
</Container>
    </div>
  );
}