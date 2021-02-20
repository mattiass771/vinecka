import React, { useState, useEffect } from "react";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

// Login.js
export default ({shoppingCart = false, handleLogin}) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordFirst, setPasswordFirst] = useState("");
  const [passwordSecond, setPasswordSecond] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [emailExists, setEmailExists] = useState(null);
  const [phone, setPhone] = useState("")

  const [street, setStreet] = useState("")
  const [postal, setPostal] = useState("")
  const [city, setCity] = useState("")

  const handleSignUp = () => {
    const fullName = middleName
      ? firstName + " " + middleName + " " + lastName
      : firstName + " " + lastName;
    const address = `${street},${postal.toString()},${city}`
    console.log(typeof phone, phone, typeof address, address )
    axios
      .post(`https://mas-vino.herokuapp.com/users/add-user`, {
        userName: email,
        password: passwordSecond,
        fullName: fullName,
        email: email,
        phone: phone,
        address: address
      })
      .then((res) => console.log(res.data))
      .catch((err) => err && console.log(`Error: ${err}`))
      .then(() => shoppingCart ? handleLogin() : window.location.reload());
  };

  const checkIfPasswordMeetsCriteria = () => {
    if (
      passwordFirst.search(/[0-9]/) !== -1 &&
      passwordFirst.search(/[a-z]/) !== -1 &&
      passwordFirst.search(/[A-Z]/) !== -1 &&
      passwordFirst &&
      passwordFirst.length > 7
    )
      return true;
    else return false;
  };

  const checkIfEmailInDatabase = () => {
    axios
      .get(`https://mas-vino.herokuapp.com/users/email/${email}`)
      .then((res) => setEmailExists(res.data))
      .catch((err) => err && console.log(`Error: ${err}`));
  };

  const checkIfEmailMeetsCriteria = () => {
    if (
      email &&
      emailExists === null &&
      email.match(/[a-z]+[.]?[a-z]*[@][a-z]+[.][a-z]{1,5}/gi)
    )
      return "";
    else if (email && email.length > 0) return "invalid-input";
  };

  const checkIfNameMeetsCriteria = (name) => {
    if (name && name.match(/^[a-z]+$/i)) return "";
    else if (name && name.length > 0) return "invalid-input";
  };

  const checkIfCityMeetsCriteria = () => {
    if (city && city.match(/^[a-z]+$/i)) return "";
    else if (city && city.length > 0) return "invalid-input";
  };

  const checkIfStreetMeetsCriteria = () => {
    if (street && street.match(/^[a-z ]+[0-9 ]+[/]{0,1}[a-z0-9 ]*$/i)) return "";
    else if (street && street.length > 0) return "invalid-input";
  };

  const checkIfPhoneMeetsCriteria = () => {
    if (phone && phone.match(/^[+]?[0-9]{6,14}[0-9]$/)) return "";
    else if (phone && phone.length > 0) return "invalid-input";
  };

  const checkIfPostalMeetsCriteria = () => {
    if (postal && postal.match(/^[0-9]{5}$/)) return "";
    else if (postal && postal.length > 0) return "invalid-input";
  };

  useEffect(() => {
    if (passwordFirst && passwordSecond && passwordFirst === passwordSecond) setPasswordsMatch(true);
    else setPasswordsMatch(false);
  }, [passwordSecond]); //eslint-disable-line

  return (
    <SlideDown className={"my-dropdown-slidedown"}>
      <Container>
        <br />
        <Row className="justify-content-md-center">
          <Col md={6} className="text-center mt-1">
            <h2>Sign up!</h2>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md={6} className="text-center mt-1">
            <label htmlFor="firstName">Meno:</label>
            <input
              className={`form-control text-center ${checkIfNameMeetsCriteria(
                firstName
              )}`}
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) =>
                setFirstName(
                  e.target.value &&
                    e.target.value[0].toUpperCase() +
                      e.target.value.substring(1)
                )
              }
            />
          </Col>
          <Col md={6} className="text-center mt-1">
            <label htmlFor="middleName">Stredné meno (voliteľné):</label>
            <input
              className={`form-control text-center ${checkIfNameMeetsCriteria(
                middleName
              )}`}
              type="text"
              name="middleName"
              value={middleName}
              onChange={(e) =>
                setMiddleName(
                  e.target.value &&
                    e.target.value[0].toUpperCase() +
                      e.target.value.substring(1)
                )
              }
            />
          </Col>
          <Col md={6} className="text-center mt-1">
            <label htmlFor="lastName">Priezvisko:</label>
            <input
              className={`form-control text-center ${checkIfNameMeetsCriteria(
                lastName
              )}`}
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) =>
                setLastName(
                  e.target.value &&
                  e.target.value[0].toUpperCase() +
                  e.target.value.substring(1)
                )
              }
            />
          </Col>
          <Col md={6} className={`text-center mt-1`}>
            <label htmlFor="email">E-mail:</label>
            <input
              className={`form-control text-center ${checkIfEmailMeetsCriteria()}`}
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={checkIfEmailInDatabase}
            />
          </Col>
          <Col md={6} className={`text-center mt-1`}>
            <label htmlFor="phone">Telefon:</label>
            <input
              className={`form-control text-center ${checkIfPhoneMeetsCriteria()}`}
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value &&
                (e.target.value).substring(0,16)
                )}
            />
          </Col>
          <Col md={6} className={`text-center mt-1`}>
            <label htmlFor="street">Ulica a číslo domu:</label>
            <input
              className={`form-control text-center ${checkIfStreetMeetsCriteria()}`}
              type="text"
              name="street"
              value={street}
              onChange={(e) => setStreet(
                e.target.value &&
                e.target.value[0].toUpperCase() +
                e.target.value.substring(1)
              )}
            />
          </Col>
          <Col md={6} className={`text-center mt-1`}>
            <label htmlFor="postal">PSČ:</label>
            <input
              className={`form-control text-center ${checkIfPostalMeetsCriteria()}`}
              type="text"
              name="postal"
              value={postal}
              onChange={(e) => setPostal(e.target.value && (e.target.value).substring(0,5))}
            />
          </Col>
          <Col md={6} className={`text-center mt-1`}>
            <label htmlFor="city">Mesto:</label>
            <input
              className={`form-control text-center ${checkIfCityMeetsCriteria()}`}
              type="text"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Col>
          <Col md={6} className="text-center mt-1">
            <label htmlFor="passwordFirst">Nové heslo:</label>
            <input
              className={`form-control text-center ${
                !checkIfPasswordMeetsCriteria() && passwordFirst.length > 0
                  ? "invalid-input"
                  : ""
              }`}
              type="password"
              name="passwordFirst"
              value={passwordFirst}
              onChange={(e) => setPasswordFirst(e.target.value)}
            />
          </Col>
          <Col md={6} className="text-center mt-1">
            <label htmlFor="passwordSecond">Zopakovať heslo:</label>
            <input
              className="form-control text-center"
              type="password"
              name="passwordSecond"
              value={passwordSecond}
              onChange={(e) => setPasswordSecond(e.target.value)}
            />
          </Col>
        </Row>
        {checkIfPasswordMeetsCriteria() ? null : (
          <Row className="justify-content-md-center">
            <Col md={6} className="text-center mt-3">
              <em style={{ color: "#7b1818" }}>
                Heslo musí mať 8 znakov a musí pozostávať z najmenej jedného veľkého, malého písmena a musí obsahovať minimálne jednu číslicu.
              </em>
            </Col>
          </Row>
        )}

        <Row className="justify-content-md-center">
          <Col md={6} className="text-center mt-3">
            {emailExists && (
              <>
                <em style={{ color: "#7b1818" }}>
                  Tento e-mail už existuje v našom systéme.
                </em>
                <br />
                <br />
              </>
            )}
            {checkIfPasswordMeetsCriteria() && !passwordsMatch && (
              <>
                <em style={{ color: "#7b1818" }}>Heslá musia byť rovnaké!</em>
              </>
            )}
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md={6} className="text-center mt-3">
            {checkIfEmailMeetsCriteria() === "" &&
            checkIfNameMeetsCriteria(firstName) === "" &&
            checkIfNameMeetsCriteria(lastName) === "" &&
            checkIfPasswordMeetsCriteria() &&
            checkIfPhoneMeetsCriteria() === "" &&
            checkIfStreetMeetsCriteria() === "" &&
            checkIfPostalMeetsCriteria() === "" &&
            checkIfCityMeetsCriteria() === "" &&
            passwordsMatch &&
            emailExists === null ? (
              <Button onClick={handleSignUp} variant="dark">
                Prihlásiť sa!
              </Button>
            ) : (
              <Button disabled variant="dark">
                Prihlásiť sa!
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </SlideDown>
  );
};
