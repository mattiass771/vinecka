import React, { useState } from "react";
import axios from 'axios'

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert'

import { useLocation, useHistory, Link } from "react-router-dom";

const token = process.env.REACT_APP_API_SECRET

// Login.js
export default () => {
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let history = useHistory();
    let query = useQuery();
    const userId = query.get('User')
    const securityKey = query.get('Secret')

    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    const [serverResponse, setServerResponse] = useState("")

    const checkIfPasswordMeetsCriteria = (input) => {
        if (input.search(/[0-9]/) !== -1 &&
            input.search(/[a-z]/) !== -1 &&
            input.search(/[A-Z]/) !== -1 &&
            input &&
            input.length > 7) {
            return "invalid-input";
        } else {
            return "";
        }
    };

    const handlePasswordChange = () => {
        if ((checkIfPasswordMeetsCriteria(repeatNewPassword) === "" &&
            checkIfPasswordMeetsCriteria(repeatNewPassword) === "" && 
            repeatNewPassword === newPassword)) {
                axios.post(`${process.env.REACT_APP_BACKEND_URL}/${userId}/password-reset-key-check/`, {token, securityKey, newPassword})
                    .then(res => {
                        const resString = res.data
                        if (resString === 'success') {
                            return history.push('/login')
                        } else {
                            setServerResponse(resString)
                            return setTimeout(() => history.push('/'), 5000)
                        }
                    })
                    .catch(err => console.log(err))
            }
    }

  return (
    <Container>
        <Alert show={serverResponse === 'expired'} variant="warning">
            <Alert.Heading>Kľúč pre zmenu hesla vypršal, ak si stále nepamätáš heslo, zadaj požiadavku prosím znova.</Alert.Heading>
        </Alert>
        <Alert show={serverResponse === 'invalid'} variant="danger">
            <Alert.Heading>Kľúč pre zmenu hesla sa nezhoduje, skús zadať požiadavku znova.</Alert.Heading>
            <p>V prípade, že by problém pretrvával, nás neváhaj kontaktovať prostredníctvom formulára, ktorý nájdeš pod sekciou <Link to="/kontakt">Kontakt</Link>.</p>
        </Alert>
        <Row className="justify-content-md-center">
            <Col md={6} className="text-center mt-3">
                <h2>Zmena hesla!</h2>
            </Col>
        </Row>
        <Row className="justify-content-md-center">
            <Col md={6} className="text-center mt-3">
                <input
                className={`form-control text-center ${checkIfPasswordMeetsCriteria(newPassword)}`}
                type="password"
                placeholder="Nové heslo"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                />
            </Col>
        </Row>
        <Row className="justify-content-md-center">
            <Col md={6} className="text-center mt-3">
                <input
                className={`form-control text-center ${checkIfPasswordMeetsCriteria(repeatNewPassword)}`}
                type="password"
                placeholder="Potvrdiť heslo"
                name="repeatNewPassword"
                value={repeatNewPassword}
                onChange={(e) => setRepeatNewPassword(e.target.value)}
                />
            </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md={6} className="text-center mt-3">
                <br />
                {(checkIfPasswordMeetsCriteria(newPassword) === "" && checkIfPasswordMeetsCriteria(repeatNewPassword) === "" && repeatNewPassword !== newPassword) &&
                    <em style={{color: 'orangered'}}>Heslá musia byť rovnaké!<br /></em>
                }
                {(checkIfPasswordMeetsCriteria(newPassword) === "invalid-input" || checkIfPasswordMeetsCriteria(repeatNewPassword) === "invalid-input") &&
                    <em style={{color: 'orangered'}}>Heslo musí mať 8 znakov a musí pozostávať z najmenej jedného veľkého, malého písmena a musí obsahovať minimálne jednu číslicu.<br /></em>
                }
                {(checkIfPasswordMeetsCriteria(repeatNewPassword) === "" &&
                    checkIfPasswordMeetsCriteria(repeatNewPassword) === "" && 
                    repeatNewPassword === newPassword) ?
                    <Button variant="dark" onClick={() => handlePasswordChange()}>Zmeniť heslo</Button> : 
                    <Button variant="dark" disabled >Zmeniť heslo</Button>
                }
            </Col>
        </Row>
    </Container>
  );
};
