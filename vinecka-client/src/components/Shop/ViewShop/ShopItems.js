import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert"

import axios from "axios";

import PageColor from "../SketchPicker/PageColor";
import ItemColor from "../SketchPicker/ItemColor";
import AddItems from "./AddItems";

import { FiPlusSquare } from "react-icons/fi";

import { Helmet } from "react-helmet";

import ShowItem from './ShowItem'

export default ({ shopData, isOwner, userId }) => {
  const [showAddItems, setShowAddItems] = useState(false);
  const [shopItems, setShopItems] = useState(shopData.shopItems);
  const [shouldReload, setShouldReload] = useState(false);
  const [showAddedPopup, setShowAddedPopup] = useState(false)
  const [showMustLoginPopup, setShowMustLoginPopup] = useState(false)

  const shopId = shopData._id

  useEffect(() => {
    if (!showAddItems) {
      setShouldReload(!shouldReload);
    }
  }, [showAddItems]); //eslint-disable-line

  useEffect(() => {
    axios
      .get(`http://localhost:5000/shop/${shopId}`)
      .then((res) => setShopItems(res.data.shopItems))
      .catch((err) => err && console.log(err.data))
      .then(() => {
        return;
      });
  }, [shouldReload]); //eslint-disable-line

  return (
    <Container className="text-center">
      {showAddedPopup &&
        <Alert style={{position: "fixed", top:56, right:0}} variant="success" onClose={() => setShowAddedPopup(false)} dismissible>
          <p>Item added to cart!</p>
        </Alert>
      }
      {showMustLoginPopup && 
        <Alert style={{position: "fixed", top:56, right:0}} variant="danger" onClose={() => setShowMustLoginPopup(false)} dismissible>
          <p>Sign in or register!</p>
        </Alert>
      }
      {isOwner &&
        <AddItems
          shopData={shopData}
          showAddItems={showAddItems}
          setShowAddItems={setShowAddItems}
        />}
      <Row>
        {/* {displayShopItems()} */}
        <ShowItem 
          shopItems={shopItems} 
          userId={userId} 
          shopId={shopId} 
          setShouldReload={setShouldReload}
          shouldReload={shouldReload}
          setShowAddedPopup={setShowAddedPopup}
          setShowMustLoginPopup={setShowMustLoginPopup}
          isOwner={isOwner}
          />
        {isOwner && 
        <Col style={{ paddingTop: "6rem" }} md={4}>
          <Card style={{ width: "12rem" }}>
            <Button
              variant="outline-dark"
              onClick={() => setShowAddItems(true)}
            >
              <FiPlusSquare
                style={{
                  margin: "0 auto",
                  height: "12rem",
                  fontSize: "400%"
                }}
              />
            </Button>
          </Card>
        </Col>}
      </Row>
    </Container>
  );
};
