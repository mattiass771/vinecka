import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

import axios from "axios";

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

import { MdDelete } from "react-icons/md";

export default ({shopItems, shopId, userId, setShouldReload, shouldReload, setShowAddedPopup, setShowMustLoginPopup, isOwner}) => {

    const [size, setSize] = useState("")
    const [color, setColor] = useState("")
    const [isHovered, setIsHovered] = useState("")
    
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

    return shopItems.map((item) => {
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

      const handleMouseOver = () => {
        let hoverObj = {}
        hoverObj[_id] = 'block'
        setIsHovered({...isHovered, ...hoverObj})
      }

      const handleMouseLeave = () => {
        let hoverObj = {}
        hoverObj[_id] = 'none'
        setIsHovered({...isHovered, ...hoverObj})
      }

      const addItemToCart = (e) => {
        const itemId = e.currentTarget.parentNode.parentNode.id;
        const passColor = color[_id] || colors[0]
        const passSize = size[_id] || sizes[0]

        console.log(shopId, itemId, passColor, passSize)
        
        if (userId) {
          axios
            .post(`http://localhost:5000/users/${userId}/cart/add-cart-item/${shopId}/${itemId}`, {
            shopId, itemId, color: passColor, size: passSize
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
        <Col className="mt-2 mb-2" style={{color: "whitesmoke"}} md={6} lg={4} xl={3} key={_id}>
          <Card onMouseEnter={() => handleMouseOver()} onMouseLeave={() => handleMouseLeave()} style={{height: "400px" }} id={_id} >
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
            <Card.Body style={{color: "Black"}}>
              <Card.Title>{itemName}</Card.Title>
              <Card.Text>{price} €</Card.Text>
            </Card.Body>
              <Card.ImgOverlay style={{ background: "rgba(52,58,64,0.4)", display: `${isHovered[_id] === 'block' ? 'block' : 'none'}`}} >
                <SlideDown className={"my-dropdown-slidedown"}>
                <Button style={{width: "100%"}} onClick={(e) => addItemToCart(e, size[_id], color[_id])} variant="dark">Add to shopping cart.</Button>
                <Container>
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
                </Container>
              </SlideDown>
            </Card.ImgOverlay>
          </Card>
        </Col>
      );
    });
  };