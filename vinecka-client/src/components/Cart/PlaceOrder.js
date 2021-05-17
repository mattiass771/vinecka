import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import { Checkbox } from 'pretty-checkbox-react';
import '@djthoms/pretty-checkbox';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Login.js
export default ({ uncheckGdpr, setUncheckGdpr ,setUserInformation, userInformation, checkedNewsletter, setCheckedNewsletter}) => {
  const [firstName, setFirstName] = useState(sessionStorage.getItem("firstName") || "");
  const [lastName, setLastName] = useState(sessionStorage.getItem("lastName") || "");
  const [email, setEmail] = useState(sessionStorage.getItem("email") || "");
  const [phone, setPhone] = useState(sessionStorage.getItem("phone") || "")

  const [street, setStreet] = useState(sessionStorage.getItem("street") || "")
  const [postal, setPostal] = useState(sessionStorage.getItem("postal") || "")
  const [city, setCity] = useState(sessionStorage.getItem("city") || "")
  
  const [checkedGdpr, setCheckedGdpr] = useState(false)

  useEffect(() => {
    if (uncheckGdpr) {
      setCheckedGdpr(false)
      setUncheckGdpr(false)
    }
  }, [uncheckGdpr])

  const handleSignUp = () => {
    const fullName = firstName.trim() + " " + lastName.trim();
    const address = `${street.trim()},${postal.toString()},${city.trim()}`
    return setUserInformation({ fullName, email, phone, address })
  };

  useEffect(() => {
    if (
      checkIfEmailMeetsCriteria() === "" &&
      checkIfNameMeetsCriteria(firstName) === "" &&
      checkIfNameMeetsCriteria(lastName) === "" &&
      checkIfPhoneMeetsCriteria() === "" &&
      checkIfStreetMeetsCriteria() === "" &&
      checkIfPostalMeetsCriteria() === "" &&
      checkIfCityMeetsCriteria() === "" &&
      checkedGdpr
    ) {
      handleSignUp()
    } else {
      setUserInformation('')
    }
  }, [firstName, lastName, email, street, city, postal, phone, checkedGdpr])

  const checkIfEmailMeetsCriteria = () => {
    if (
      email &&
      email.match(/[a-z0-9]+[.]?[a-z0-9]*[@][a-z0-9]+[.][a-z0-9]{1,5}/gi)
    )
      return "";
    else if (email && email.length > 0) return "invalid-input";
  };

  const checkIfNameMeetsCriteria = (name) => {
    if (name && name.match(/^[a-zá-ž ]+$/i)) return "";
    else if (name && name.length > 0) return "invalid-input";
  };

  const checkIfCityMeetsCriteria = () => {
    if (city && city.match(/^[a-zá-ž ]+$/i)) return "";
    else if (city && city.length > 0) return "invalid-input";
  };

  const checkIfStreetMeetsCriteria = () => {
    if (street && street.match(/^[a-zá-ž ]+[0-9]{1}[0-9 ]*[/]{0,1}[a-z0-9]*$/i)) return "";
    else if (street && street.length > 0) return "invalid-input";
  };

  const checkIfPhoneMeetsCriteria = () => {
    if (phone && phone.match(/^[+]?[0-9 ]{6,14}[0-9]$/)) return "";
    else if (phone && phone.length > 0) return "invalid-input";
  };

  const checkIfPostalMeetsCriteria = () => {
    if (postal && postal.match(/^[0-9 ]{5}$/)) return "";
    else if (postal && postal.length > 0) return "invalid-input";
  };

  const handleSessionStorage = (customKey, value) => {
    return sessionStorage.setItem(customKey, value)
  }

  return (
      <Container className="pb-4">
        <br />
        <Row className="justify-content-md-center">
          <Col md={6} className="text-center mt-1">
            <label htmlFor="firstName">Meno:</label>
            <input
              className={`form-control text-center ${checkIfNameMeetsCriteria(
                firstName
              )}`}
              placeholder="povinné"
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
              onBlur={() => handleSessionStorage('firstName', firstName)}
              readOnly={typeof userInformation === 'object'}
            />
          </Col>
          <Col md={6} className="text-center mt-1">
            <label htmlFor="lastName">Priezvisko:</label>
            <input
              className={`form-control text-center ${checkIfNameMeetsCriteria(
                lastName
              )}`}
              placeholder="povinné"
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
              onBlur={() => handleSessionStorage('lastName', lastName)}
              readOnly={typeof userInformation === 'object'}
            />
          </Col>
          <Col md={6} className={`text-center mt-1`}>
            <label htmlFor="email">E-mail:</label>
            <input
              className={`form-control text-center ${checkIfEmailMeetsCriteria()}`}
              placeholder="povinné"
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleSessionStorage('email', email)}
              readOnly={typeof userInformation === 'object'}
            />
          </Col>
          <Col md={6} className={`text-center mt-1`}>
            <label htmlFor="phone">Telefón:</label>
            <input
              className={`form-control text-center ${checkIfPhoneMeetsCriteria()}`}
              placeholder="povinné"
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value &&
                (e.target.value).substring(0,16)
                )}
                onBlur={() => handleSessionStorage('phone', phone)}
                readOnly={typeof userInformation === 'object'}
            />
          </Col>
          <Col md={6} className={`text-center mt-1`}>
            <label htmlFor="street">Ulica a číslo domu:</label>
            <input
              className={`form-control text-center ${checkIfStreetMeetsCriteria()}`}
              placeholder="povinné"
              type="text"
              name="street"
              value={street}
              onChange={(e) => setStreet(
                e.target.value &&
                e.target.value[0].toUpperCase() +
                e.target.value.substring(1)
              )}
              onBlur={() => handleSessionStorage('street', street)}
              readOnly={typeof userInformation === 'object'}
            />
          </Col>
          <Col md={6} className={`text-center mt-1`}>
            <label htmlFor="postal">PSČ:</label>
            <input
              className={`form-control text-center ${checkIfPostalMeetsCriteria()}`}
              placeholder="povinné"
              type="text"
              name="postal"
              value={postal}
              onChange={(e) => setPostal(e.target.value && (e.target.value).substring(0,5))}
              onBlur={() => handleSessionStorage('postal', postal)}
              readOnly={typeof userInformation === 'object'}
            />
          </Col>
          <Col md={6} className={`text-center mt-1`}>
            <label htmlFor="city">Mesto:</label>
            <input
              className={`form-control text-center ${checkIfCityMeetsCriteria()}`}
              placeholder="povinné"
              type="text"
              name="city"
              value={city}
              onChange={(e) => setCity(
                e.target.value &&
                e.target.value[0].toUpperCase() +
                e.target.value.substring(1)
              )}
              onBlur={() => handleSessionStorage('city', city)}
              readOnly={typeof userInformation === 'object'}
            />
          </Col>
        </Row>
        <Row className="justify-content-center mt-2">
          <Col md={10}>
            <em style={{float: 'left', color: (!checkedGdpr && firstName && lastName && email && phone && street && postal && city) ? '#7b1818' : ''}}>
              <Checkbox 
                  style={{
                      cursor: 'pointer',
                  }}
                  color="warning"
                  shape="curve"
                  animation="jelly"
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
                <Checkbox 
                    style={{
                        cursor: 'pointer',
                    }}
                    color="warning"
                    shape="curve"
                    animation="jelly"
                    name='checkedNewsletter'
                    checked={checkedNewsletter}
                    onChange={() => setCheckedNewsletter(!checkedNewsletter)}
                />&nbsp;
                Chcem odoberať newsletter a týmto súhlasím s odoberaním newslettra eshopu masvino.sk. Tento súhlas môžete odvolať, napríklad <Link to="/odhlasit-newsletter">tu</Link>, alebo na konci každého newsletter emailu.</em>
            </Col>
        </Row>
      </Container>
  );
};
