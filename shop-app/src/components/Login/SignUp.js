import React, { useState, useEffect } from "react";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

// Login.js
export default () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordFirst, setPasswordFirst] = useState("");
  const [passwordSecond, setPasswordSecond] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [emailExists, setEmailExists] = useState(null);

  const handleSignUp = () => {
    const fullName = middleName
      ? firstName + " " + middleName + " " + lastName
      : firstName + " " + lastName;
    axios
      .post(`http://localhost:5000/users/add-user`, {
        userName: email,
        password: passwordSecond,
        fullName: fullName,
        email: email
      })
      .then((res) => console.log(res.data))
      .catch((err) => err && console.log(`Error: ${err}`))
      .then(() => window.location.reload());
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
      .get(`http://localhost:5000/users/email/${email}`)
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

  useEffect(() => {
    if (passwordFirst === passwordSecond) setPasswordsMatch(true);
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
            <label htmlFor="firstName">First Name:</label>
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
            <label htmlFor="middleName">Middle Name (Optional):</label>
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
            <label htmlFor="lastName">Last Name:</label>
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
          <Col md={6} className="text-center mt-1">
            <label htmlFor="passwordFirst">New Password:</label>
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
            <label htmlFor="passwordSecond">Repeat Password:</label>
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
                Password must be at least 8 characters long and must contain one
                lowercase, one uppercase character and one number.
              </em>
            </Col>
          </Row>
        )}

        <Row className="justify-content-md-center">
          <Col md={6} className="text-center mt-3">
            {emailExists && (
              <>
                <em style={{ color: "#7b1818" }}>
                  This e-mail is already registered in our system!
                </em>
                <br />
                <br />
              </>
            )}
            {checkIfPasswordMeetsCriteria() && !passwordsMatch && (
              <>
                <em style={{ color: "#7b1818" }}>Passwords must match!</em>
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
            passwordsMatch &&
            emailExists === null ? (
              <Button onClick={handleSignUp} variant="dark">
                Sign up!
              </Button>
            ) : (
              <Button disabled variant="dark">
                Sign up!
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </SlideDown>
  );
};
