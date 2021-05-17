import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import axios from "axios";

import AddItems from "./AddItems";

import { FiPlusSquare } from "react-icons/fi";

import ShowItem from './ShowItem'

const token = process.env.REACT_APP_API_SECRET

export default ({ shopData, isOwner, userId, shoppingCart, setShoppingCart }) => {
  const [showAddItems, setShowAddItems] = useState(false);
  const [shopItems, setShopItems] = useState(shopData.shopItems);
  const [shouldReload, setShouldReload] = useState(false);

  const shopId = shopData._id

  useEffect(() => {
    if (!showAddItems) {
      setShouldReload(!shouldReload);
    }
  }, [showAddItems]); //eslint-disable-line

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/shop/get-shop/${shopId}`, {token})
      .then((res) => setShopItems(res.data.shopItems))
      .catch((err) => err && console.log(err.data))
      .then(() => {
        return;
      });
  }, [shouldReload]); //eslint-disable-line

  return (
    <Container className="text-center pt-4 pb-4 mb-4">
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
          isOwner={isOwner}
          shoppingCart={shoppingCart} 
          setShoppingCart={setShoppingCart}
          />
        {isOwner && 
        <Col className="mt-2 mb-2" md={6} lg={4} xl={3}>
          <Card style={{height: '400px'}}>
            <Button
              variant="outline-light"
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
