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

export default ({userId}) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [checkedGdpr, setCheckedGdpr] = useState(false)
    const [checkedNewsletter, setCheckedNewsletter] = useState(false)

    const sendEmail = (e) => {
        e.preventDefault();
        setSending(true)

        emailjs.sendForm('service_vjc9vdo', 'template_o2r5vl8', e.target, 'user_Pp2MD3ZQeVhPpppItiah8')
        .then((result) => {
            if (checkedNewsletter) {
                axios.post(`https://mas-vino.herokuapp.com/mails/add`, {name, email})
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

  return (
    <div className="whitesmoke-bg-pnine">
        <Container className="py-4">
            <Row className="mb-4 mt-4 text-center justify-content-center">
                <Col xs={3}><hr style={{backgroundColor: '#2b371b', height: '1px', marginTop: '22px'}} /></Col>
                <Col xs={6}><h1>Kontaktujte nás!</h1></Col>
                <Col xs={3}><hr style={{backgroundColor: '#2b371b', height: '1px', marginTop: '22px'}} /></Col>
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
            <Row className="text-left my-4" style={{fontSize: "150%"}}>
                <Col xs={{offset: 2, span: 4}}>IBAN:</Col>
                <Col xs={{span: 6}}><strong>SK21 1111 0000 0016 0902 7005</strong></Col>
                <Col xs={{offset: 2, span: 4}}>BIC/SWIFT:</Col>
                <Col xs={{span: 6}}><strong>UNCRSKBX</strong></Col>
                <Col xs={{offset: 2, span: 4}}>VARIABILNY SYMBOL:</Col>
                <Col xs={{span: 6}}><strong>ID objednávky{userId && ` (nájdete v sekcii ${<Link to="/objednavky">Objednávky</Link>})`}</strong></Col>
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
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBoH4TWYVkhYfKSLFAlTn-h4nGOZrLR2SI&v=3.exp&libraries=geometry,drawing,places"
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