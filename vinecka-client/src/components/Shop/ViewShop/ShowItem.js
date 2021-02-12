import React, { useState } from "react";
import {Link} from 'react-router-dom';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

import axios from "axios";

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

import { MdDelete, MdEdit } from "react-icons/md";

import EditItems from "./EditItems";

export default ({colMdSettings, colXsSettings, shopItems, shopId, userId, setShouldReload, shouldReload, setShowAddedPopup, isOwner, url}) => {
    const [count, setCount] = useState("")
    const [isHovered, setIsHovered] = useState("")
    const [clicked, setClicked] = useState('')
    const [editing, setEditing] = useState('')

    const copyFunction = (passId) => {
      const dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = passId;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      setClicked('#333333')
      setTimeout(() => setClicked(''),150)
    }
    
    const getImage = (image) => {
      try {
          const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
          return img;
      } catch {
          return null;
      }
    };

    const deleteCard = (e) => {
      const itemId = e.currentTarget.parentNode.id;
      axios
          .post(
          `https://mas-vino.herokuapp.com/shop/${shopId}/delete-item/${itemId}`,
          {}
          )
          .then(() => setShouldReload(!shouldReload))
          .catch((err) => err && console.log(`Error ${err}`));
    };

    return shopItems.map((item) => {
      const { _id, itemName, price, description, imageLink, maxCount } = item;
      const passShopId = shopId === 'home' ? item.shopId : shopId

      const image = getImage(imageLink)
        ? getImage(imageLink)
        : imageLink;

      const showCount = () => {
        let result = []
        for (let num = 1; num<= (maxCount ?? 200); num++) {
          result.push(<option key={num} value={num}>{num}</option>)
        }
        
        return result
      }

      const handleCount = (e) => {
        let countObj = {}
        countObj[_id] = e.target.value
        setCount({...count, ...countObj})
      }

      const handleEditing = (e) => {
        const itemId = e.currentTarget.parentNode.id;
        let editingObj = {}
        editingObj[itemId] = true
        setEditing({...editing, ...editingObj})
      }

      const handleMouseOver = () => {
        let hoverObj = {}
        hoverObj[_id] = 'block'
        setIsHovered({...isHovered, ...hoverObj})
      }

      const handleMouseLeave = () => {
        setIsHovered("")
      }

      const addItemToCart = (e) => {
        const itemId = e.currentTarget.parentNode.parentNode.parentNode.id;
        const passCount = count[_id] || 1
        if (userId) {
          axios
            .post(`https://mas-vino.herokuapp.com/users/${userId}/cart/add-cart-item/${passShopId}/${itemId}`, {
            shopId: passShopId, itemId, count: passCount
            })
            .then(() => setShowAddedPopup(true))
            .catch(err => err && console.log(err))
            .then(() => setTimeout(() => setShowAddedPopup(false), 5000))
        } else {
          const localShoppingCart = localStorage.getItem('shoppingCart')
          localStorage.removeItem('shoppingCart')
          const newShoppingCart = localShoppingCart ? [...JSON.parse(localShoppingCart), {shopId: passShopId, itemId, count: passCount}] : [{shopId: passShopId, itemId, count: passCount}]
          localStorage.setItem('shoppingCart', JSON.stringify(newShoppingCart))
          setShowAddedPopup(true)
          setTimeout(() => setShowAddedPopup(false), 5000)
        }
      }
      return (
        <Col className="mt-2 mb-2" style={{color: "whitesmoke"}} xs={colXsSettings ?? 6} md={colMdSettings ?? 6} lg={colMdSettings ?? 4} xl={colMdSettings ?? 3} key={_id}>
          <Card onMouseEnter={() => handleMouseOver()} onMouseLeave={() => handleMouseLeave()} style={{height: "410px" }} id={_id} >
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
            {isOwner &&
            <Button
              onClick={(e) => handleEditing(e)}
              style={{
                width: "40px",
                height: "40px",
                marginBottom: "-40px",
                marginLeft: "40px",
                zIndex: "+5"
              }}
              variant="outline-warning"
            >
              <MdEdit style={{ fontSize: "150%", margin: "0 0 15px -5px" }} />
            </Button>}
            {editing[_id] && <EditItems shouldReload={shouldReload} setShouldReload={setShouldReload} itemDataProp={item} showEditItems={editing[_id]} setShowEditItems={setEditing} shopId={passShopId} itemId={_id} />}
            <Card.Img className="shop-item-img mt-4" variant="top" src={image} />
            <Card.Body style={{color: "Black"}}>
              <Card.Title>{itemName}</Card.Title>
              <Card.Text>{price} €</Card.Text>
            </Card.Body>
            <Card.ImgOverlay style={{ background: "rgba(52,58,64,0.7)", display: `${isHovered[_id] === 'block' ? 'block' : 'none'}`}} >
              <SlideDown className={"my-dropdown-slidedown"}>
                <Button style={{width: "100%"}} onClick={(e) => addItemToCart(e)} variant="dark">Add to shopping cart.</Button>
                <Container>
                  <Row className="mt-2">
                    <Col>
                      <Form.Control
                        as="select"
                        value={count[_id]}
                        onChange={(e) => handleCount(e)}
                      >
                        {showCount()}
                      </Form.Control>
                    </Col>
                  </Row>
                  {isOwner &&
                  <Row>
                    <Col><a onClick={() => copyFunction(_id)} style={{textDecoration: 'none', cursor: 'pointer', color: clicked}}><strong>copy my id!</strong></a></Col>
                  </Row>}
                  <Row style={{height: '240px', marginTop: '5px', marginBottom: '5px'}}>
                    <Col>{description}</Col>
                  </Row>
                  {url && 
                    <Link to={`/${url}`}>
                      <Button style={{width: "100%"}} variant="dark">Visit shop.</Button>
                    </Link>
                  }
                </Container>
              </SlideDown>
            </Card.ImgOverlay>
          </Card>
        </Col>
      );
    });
  };