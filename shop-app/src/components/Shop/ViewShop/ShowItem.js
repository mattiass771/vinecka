import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import axios from "axios";

import { MdDelete } from "react-icons/md";

export default ({shopItems, shopId, userId, itemsColor, setShouldReload, shouldReload, setShowAddedPopup, setShowMustLoginPopup, isOwner}) => {

    const [size, setSize] = useState("")
    const [color, setColor] = useState("")

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

      const handleSize = (e) => {
        let sizeObj = {}
        sizeObj[_id] = e.target.value
        setSize({...size, ...sizeObj})
      }

      const handleColor = (e) => {
        let colorObj = {}
        colorObj[_id] = e.target.value
        setColor({...color, ...colorObj})
      }

      const addItemToCart = (e) => {
        const itemId = e.currentTarget.parentNode.parentNode.id;
        const passColor = color[_id] || colors[0]
        const passSize = size[_id] || sizes[0]
        const count = 1

        console.log(shopId, itemId, passColor, passSize, count)
        
        if (userId) {
          axios
            .post(`http://localhost:5000/users/${userId}/cart/add-cart-item/${shopId}/${itemId}`, {
            shopId, itemId, color: passColor, size: passSize, count
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
          <Card style={{ width: "18rem", backgroundColor: itemsColor, color: getColorByBgColor(itemsColor) }} id={_id} >
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
                    value={size[_id]}
                    onChange={(e) => handleSize(e)}
                  >
                    {showSizes()}
                  </Form.Control>
                </Col> : null}
                {colors ?
                <Col>
                  <Form.Control
                    as="select"
                    value={color[_id]}
                    onChange={(e) => handleColor(e)}
                  >
                    {showColors()}
                  </Form.Control>
                </Col> : null}
              </Row>
              <hr />
              <Row>
                <Col>{description}</Col>
              </Row>
              <Button onClick={(e) => addItemToCart(e, size[_id], color[_id])} className="mt-4" variant="dark" id="kkt" >Add to cart.</Button>
            </Card.Body>
          </Card>
        </Col>
      );
    });
    return output;
  };