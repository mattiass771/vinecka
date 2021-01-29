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
  const { shopName, owner, description, url } = shopData;
  const [currentUrl, setCurrentUrl] = useState(url)
  const [isUrlAvailible, setIsUrlAvailible] = useState(true)

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
    <Jumbotron fluid>
      <Container className="text-center">
        <Row>
          <Col>
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
