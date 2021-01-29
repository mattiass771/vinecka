import React, { useState, useEffect } from "react";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
import InputGroup from "react-bootstrap/InputGroup"
import Button from "react-bootstrap/Button"

import JumboColor from "../SketchPicker/JumboColor";
import JumboTextColor from "../SketchPicker/JumboTextColor";

import {FaCheckSquare} from "react-icons/fa"

// CreateShop.js
export default ({ shopData, isOwner }) => {
  const [jumboColor, setJumboColor] = useState(shopData.shopPref.jumboColor);
  const [jumboTextColor, setJumboTextColor] = useState(
    shopData.shopPref.jumboTextColor
  );
  const [showJumboColor, setShowJumboColor] = useState(false);
  const [showJumboTextColor, setShowJumboTextColor] = useState(false);
  const { shopName, owner, description, url } = shopData;
  const [currentUrl, setCurrentUrl] = useState(url)
  const [isUrlAvailible, setIsUrlAvailible] = useState(true)

  useEffect(() => {
    const setColor = jumboColor.replace("#", "_");
    axios
      .put(
        `http://localhost:5000/shop/${shopData._id}/update-pref/jumboColor/${setColor}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && console.log("error setting jumboColor: " + err));
  }, [jumboColor]); //eslint-disable-line

  useEffect(() => {
    const setColor = jumboTextColor.replace("#", "_");
    axios
      .put(
        `http://localhost:5000/shop/${shopData._id}/update-pref/jumboTextColor/${setColor}`
      )
      .then((res) => {
        return;
      })
      .catch(
        (err) => err && console.log("error setting jumboTextColor: " + err)
      );
  }, [jumboTextColor]); //eslint-disable-line

  useEffect(() => {
    axios
      .get(`http://localhost:5000/shop/link/${currentUrl}`)
      .then((res) => {
        if (res.data && res.data.url !== currentUrl) setIsUrlAvailible(false)
        else setIsUrlAvailible(true)
      })
      .catch((err) => err && console.log(err))
  }, [currentUrl])

  const handleUrlChange = () => {
    if (isUrlAvailible) {
      axios
      .put(
        `http://localhost:5000/shop/${shopData._id}/update-shop/url/${currentUrl}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && console.log("error setting url: " + err));
    }
  }

  return (
    <Jumbotron style={{ backgroundColor: jumboColor }} fluid>
      <Container style={{ color: jumboTextColor }} className="text-center">
        <Row>
          <Col>
          {isOwner &&
            <>
              <div>
                <JumboTextColor
                  setShowJumboTextColor={setShowJumboTextColor}
                  showJumboTextColor={showJumboTextColor}
                  setJumboTextColor={setJumboTextColor}
                  jumboTextColor={jumboTextColor}
                />
              </div>
              <div style={{ marginLeft: "90%", marginBottom: "-36px" }}>
                <JumboColor
                  setShowJumboColor={setShowJumboColor}
                  showJumboColor={showJumboColor}
                  setJumboColor={setJumboColor}
                  jumboColor={jumboColor}
                />
              </div>
            </>}
            <h2>{shopName}</h2>
            <p>{description}</p>
            <p>Owner: {owner}</p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={6}>
            {isOwner &&
            <div>
            <p style={{marginRight: 10, marginTop: 5}}>Your current url is: </p>
                <InputGroup>
                  <input 
                    className={isUrlAvailible ? 'form-control text-center' : 'text-center form-control invalid-input'}
                    value={currentUrl} 
                    onChange={(e) => setCurrentUrl(e.target.value)} 
                    name="currentUrl"
                  />
                  <Button onClick={handleUrlChange} variant="dark">
                    <FaCheckSquare style={{marginBottom:"3px",marginLeft:"-1px"}} />
                  </Button>
                </InputGroup>
              {!isUrlAvailible && <p style={{color: "red"}}>The url is already taken.</p>}
            </div>
            }
          </Col>
        </Row>
      </Container>
    </Jumbotron>
  );
};
