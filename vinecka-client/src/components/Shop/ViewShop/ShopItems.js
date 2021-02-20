import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert"

import axios from "axios";

import AddItems from "./AddItems";

import { FiPlusSquare } from "react-icons/fi";

import ShowItem from './ShowItem'

export default ({ shopData, isOwner, userId }) => {
  const [showAddItems, setShowAddItems] = useState(false);
  const [shopItems, setShopItems] = useState(shopData.shopItems);
  const [shouldReload, setShouldReload] = useState(false);
  const [showAddedPopup, setShowAddedPopup] = useState(false)

  const shopId = shopData._id

  useEffect(() => {
    if (!showAddItems) {
      setShouldReload(!shouldReload);
    }
  }, [showAddItems]); //eslint-disable-line

  useEffect(() => {
    axios
      .get(`https://mas-vino.herokuapp.com/shop/${shopId}`)
      .then((res) => setShopItems(res.data.shopItems))
      .catch((err) => err && console.log(err.data))
      .then(() => {
        return;
      });
  }, [shouldReload]); //eslint-disable-line

  return (
    <Container className="text-center">
      {showAddedPopup &&
        <Alert style={{position: "fixed", zIndex: '+9', top:156, right:0}} variant="success" onClose={() => setShowAddedPopup(false)} dismissible>
          Polozka bola pridana do kosika!
        </Alert>
      }
      {isOwner &&
        <AddItems
          shopData={shopData}
          showAddItems={showAddItems}
          setShowAddItems={setShowAddItems}
        />}
      <Row>
        <ShowItem 
          shopItems={shopItems} 
          userId={userId} 
          shopId={shopId} 
          setShouldReload={setShouldReload}
          shouldReload={shouldReload}
          setShowAddedPopup={setShowAddedPopup}
          isOwner={isOwner}
          />
        {isOwner && 
        <Col className="mt-2 mb-2" md={6} lg={4} xl={3}>
          <Card style={{height: '400px'}}>
            <Button
              variant="outline-dark"
              style={{ border: '0px', height: '100%'}}
              onClick={() => setShowAddItems(true)}
            >
              <FiPlusSquare
                style={{
                  margin: "0 auto",
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
