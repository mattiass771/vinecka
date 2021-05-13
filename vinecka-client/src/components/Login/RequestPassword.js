import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { nanoid } from 'nanoid'
import emailjs from 'emailjs-com';
import ReCAPTCHA from "react-google-recaptcha";

import { Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

const token = process.env.REACT_APP_API_SECRET

export default ({showPassReqPopup, setShowPassReqPopup}) => {
    const [emailExists, setEmailExists] = useState("");
    const [email, setEmail] = useState("")
    const [emailSent, setEmailSent] = useState("")
    const [captchaStatus, setCaptchaStatus] = useState("failed")

    const onChange = (value) => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/verify-recaptcha`, {token, responseToken: value})
            .then(res => {
                const apiResponse = res.data
                setCaptchaStatus(apiResponse.success === true ? "success" : "failed")
            })
            .catch(err => console.log(err))
    }

    const checkIfEmailInDatabase = () => {
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/users/email/${email}`, {token})
          .then((res) => setEmailExists(res.data || "invalid"))
          .catch((err) => err && console.log(`Error: ${err}`));
    };

    const checkIfEmailMeetsCriteria = () => {
        if (
          email &&
          email.match(/[a-z0-9]+[.]?[a-z0-9]*[@][a-z0-9]+[.][a-z]{1,5}/gi)
        )
          return "";
        else if (email && email.length > 0) return "invalid-input";
    };

    const handlePasswordChange = () => {
        const newSecret = nanoid()
        const newPasswordLink = `${process.env.REACT_APP_FRONTEND_URL}/zmena-hesla?User=${email}&Secret=${newSecret}`
        const emailData = {newPasswordLink, email}
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/add-reset-password-key/`, {newSecret, email, token})
            .then(res => {
                emailjs.send('service_d4aksie', 'template_qw25glf', emailData, process.env.REACT_APP_EMAILJS_USERID)
                    .then((result) => {
                        setEmailSent("success")
                        console.log('mail created.')
                        
                    }, (error) => {
                        setEmailSent("error")
                        console.log('error mail', error)
                    });
            }).catch(err => {
                setEmailSent("error")
                console.log('error request', err)
            })
    }

    useEffect(() => {
        if (checkIfEmailMeetsCriteria() === "") {
            checkIfEmailInDatabase()
        } else (
            setEmailExists("invalid")
        )
    }, [email])

    return (
        <Modal size="lg" show={showPassReqPopup} onHide={() => setShowPassReqPopup(false)}>
            <Modal.Body className="text-center" style={{fontSize: "90%", backgroundColor: 'whitesmoke'}}>
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md={6} className="text-center mt-3">
                            <h3>Žiadosť o zmenu hesla.</h3>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md={10} className="text-center mt-3">
                            <p>
                                Stačí zadať e-mail a potvrdiť žiadosť. Do vašej e-mailovej schránky obdržíte správu s vygenerovanou adresou, 
                                pod ktorou si následne zmeníte heslo na nové.
                            </p>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col lg={6} className="text-center mt-3">
                            <label htmlFor="email">E-mail:</label>
                            <input
                                className={`form-control text-center ${emailExists !== "invalid" ? checkIfEmailMeetsCriteria() : !email ? "" : "invalid-input"}`}
                                type="text"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="povinné"
                            />
                        </Col>
                    </Row>
                    <Row className="justify-content-center text-center">
                        <Col>
                            <ReCAPTCHA
                                sitekey="6Lf_X8caAAAAAAWTk4wcZQibdqo9zI41rTPVjSVg"
                                onChange={onChange}
                            />
                        </Col>
                    </Row> 
                    {emailExists === "invalid" && checkIfEmailMeetsCriteria() === "" &&
                    <Row className="justify-content-md-center">
                        <Col md={6} className="text-center mt-3">
                            <em style={{color: 'orangered'}}>Bol zadaný e-mail, ktorý u nás ešte nebol zaregistrovaný.</em>
                        </Col>
                    </Row>}
                    <Alert show={emailSent === 'success'} variant="success">
                        <Alert.Heading>Požiadavka bola úspešne odoslaná, skontroluj si schránku.</Alert.Heading>
                    </Alert>
                    <Alert show={emailSent === 'error'} variant="danger">
                        <Alert.Heading>Požiadavka nebola odoslaná, skús to prosím neskôr.</Alert.Heading>
                        <p>V prípade, že by problém pretrvával nás neváhaj kontaktovať prostredníctvom formulára, ktorý nájdeš pod sekciou <Link to="/kontakt">Kontakt</Link>.</p>
                    </Alert>
                    <Alert show={emailSent === 'wrong-captcha'} variant="danger">
                        <Alert.Heading>Nespravny kod Captcha!</Alert.Heading>
                    </Alert>
                </Container> 
            </Modal.Body>
            <Modal.Footer className="row justify-content-center text-center">
                {emailExists !== "invalid" && checkIfEmailMeetsCriteria() === "" && !emailSent && captchaStatus === "success"  ?
                <Button variant="dark" onClick={() => handlePasswordChange()}>
                    Vyžiadať zmenu hesla
                </Button> : 
                <Button variant="dark" disabled>
                    Vyžiadať zmenu hesla
                </Button>}
                <Button variant="dark" onClick={() => setShowPassReqPopup(false)}>
                    Zavrieť
                </Button>
            </Modal.Footer>
        </Modal>
    )
}