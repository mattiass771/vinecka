import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert"

import axios from "axios";

import PageColor from "../SketchPicker/PageColor";
import ItemColor from "../SketchPicker/ItemColor";
import AddItems from "./AddItems";

import { FiPlusSquare } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

import { Helmet } from "react-helmet";

export default ({ shopData, isOwner, userId }) => {
  const [pageColor, setPageColor] = useState(shopData.shopPref.pageColor);
  const [showPageColor, setShowPageColor] = useState(false);
  const [showAddItems, setShowAddItems] = useState(false);
  const [shopItems, setShopItems] = useState(shopData.shopItems);
  const [shouldReload, setShouldReload] = useState(false);
  const [itemsColor, setItemsColor] = useState(shopData.shopPref.itemColor)
  const [showItemsColor, setShowItemsColor] = useState(false);
  const [showAddedPopup, setShowAddedPopup] = useState(false)
  const [showMustLoginPopup, setShowMustLoginPopup] = useState(false)

  const [size, setSize] = useState("")
  const [color, setColor] = useState("")

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

  useEffect(() => {
    const setColor = pageColor.replace("#", "_");
    axios
      .put(
        `http://localhost:5000/shop/${shopId}/update-pref/pageColor/${setColor}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && console.log("error setting pageColor: " + err));
  }, [pageColor]); //eslint-disable-line

  useEffect(() => {
    const setColor = itemsColor.replace("#", "_");
    axios
      .put(
        `http://localhost:5000/shop/${shopId}/update-pref/itemColor/${setColor}`
      )
      .then((res) => {
        return;
      })
      .catch((err) => err && console.log("error setting itemsColor: " + err));
  }, [itemsColor]); //eslint-disable-line

  const getColorByBgColor = (bgColor) => {
    if (!bgColor) { return ''; }
    return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#333333' : 'whitesmoke';
  }

  const getImage = (image) => {
    try {
      const img = require(`../../../../../src/uploads/${image}`);
      return img;
    } catch {
      return null;
    }
  };

  const deleteCard = (e) => {
    const itemId = e.currentTarget.parentNode.id;
    axios
      .post(
        `http://localhost:5000/shop/${shopId}/delete-item/${itemId}`,
        {}
      )
      .then(() => setShouldReload(!shouldReload))
      .catch((err) => err && console.log(`Error ${err}`));
  };

  const displayShopItems = () => {
    const output = shopItems.map((item) => {
      const { _id, itemName, price, description, imageLink, sizes, colors } = item;
      const image = getImage(imageLink)
        ? getImage(imageLink)
        : imageLink;

      const showSizes = () => {
        return sizes.map((el) => {
          return <option key={el} value={el}>{el}</option>
        })
      }

      const showColors = () => {
        return colors.map((el) => {
          return <option key={el} value={el}>{el}</option>
        })
      }

      const addItemToCart = (e) => {
        const itemId = e.currentTarget.parentNode.parentNode.id;
        if (userId) {
          axios
            .post(`http://localhost:5000/users/${userId}/cart/add-cart-item/${shopId}/${itemId}`, {
            shopId, itemId
            })
            .then(() => setShowAddedPopup(true))
            .catch(err => err && console.log(err))
            .then(() => setTimeout(() => setShowAddedPopup(false), 5000))
        } else {
          setShowMustLoginPopup(true)
          setTimeout(() => setShowMustLoginPopup(false), 5000)
        }
      }

      return (
        <Col className="mt-2 mb-2" md={4} key={_id}>
          <Card style={{ width: "18rem", backgroundColor: itemsColor, color: getColorByBgColor(itemsColor) }} id={_id}>
            {isOwner &&
            <Button
              onClick={(e) => deleteCard(e)}
              style={{
                width: "40px",
                height: "40px",
                marginBottom: "-40px",
                zIndex: "+5"
              }}
              variant="outline-danger"
            >
              <MdDelete style={{ fontSize: "150%", margin: "0 0 15px -5px" }} />
            </Button>}
            <Card.Img className="shop-item-img" variant="top" src={image} />
            <Card.Body>
              <Card.Title>
                {itemName}
              </Card.Title>
              <Row>
                <Col><h5>Price: {price} €</h5></Col>
              </Row>
              <Row className="mt-2">
                {sizes ? 
                <Col>
                  <Form.Control
                    as="select"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  >
                    {showSizes()}
                  </Form.Control>
                </Col> : null}
                {colors ?
                <Col>
                  <Form.Control
                    as="select"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    {showColors()}
                  </Form.Control>
                </Col> : null}
              </Row>
              <hr />
              <Row>
                <Col>{description}</Col>
              </Row>
              <Button onClick={(e) => addItemToCart(e)} className="mt-4" variant="dark">Add to cart.</Button>
            </Card.Body>
          </Card>
        </Col>
      );
    });
    return output;
  };

  return (
    <Container className="text-center">
      <Helmet>
        <style>{`body { background-color: ${pageColor}; }`}</style>
      </Helmet>
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
      <>
      <AddItems
        shopData={shopData}
        showAddItems={showAddItems}
        setShowAddItems={setShowAddItems}
      />
      
      <Row>
        <Col md={1}>
          <ItemColor
            setShowItemsColor={setShowItemsColor}
            showItemsColor={showItemsColor}
            setItemsColor={setItemsColor}
            itemsColor={itemsColor}
          />
        </Col>
        <Col md={{span:1, offset:10}}>
          <PageColor
            setShowPageColor={setShowPageColor}
            showPageColor={showPageColor}
            setPageColor={setPageColor}
            pageColor={pageColor}
          />
        </Col>
      </Row></>}
      <Row>
        {displayShopItems()}
        {isOwner && 
        <Col style={{ paddingTop: "6rem" }} md={4}>
          <Card style={{ width: "12rem", backgroundColor: itemsColor }}>
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
