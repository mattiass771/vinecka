import React, { useState } from "react";
import {Link} from 'react-router-dom';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import axios from "axios";

import { MdDelete, MdEdit } from "react-icons/md";

import EditItems from "./EditItems";

const token = process.env.REACT_APP_API_SECRET

export default ({ shopItems, shopId, userId, setShouldReload, shouldReload, isOwner, url, setUpdateCart, updateCart}) => {
    const [count, setCount] = useState("")
    const [isHovered, setIsHovered] = useState("")
    const [clicked, setClicked] = useState('')
    const [editing, setEditing] = useState('')
    const [showAddedPopup, setShowAddedPopup] = useState(false)
    const [hoverTimeout, setHoverTimeout] = useState('')

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
          `${process.env.REACT_APP_BACKEND_URL}/shop/${shopId}/delete-item/${itemId}`,
          {token}
          )
          .then(() => setShouldReload(!shouldReload))
          .catch((err) => err && console.log(`Error ${err}`));
    };

    const handleMouseOver = (id) => {
      let hoverObj = {}
      hoverObj[id] = 'block'
      setIsHovered(hoverObj)
      setTimeout(() => setHoverTimeout(hoverObj), 250)
    }

    const handleMouseLeave = () => {
      setIsHovered("")
      setHoverTimeout("")
    }

    return shopItems.map((item, i) => {
      const { _id, itemName, price, description, imageLink, maxCount, color, taste } = item;
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

      const addItemToCart = (e) => {
        const itemId = e.currentTarget.parentNode.parentNode.id;
        const passCount = count[_id] || 1
        if (userId) {
          axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/cart/add-cart-item/${passShopId}/${itemId}`, {
            shopId: passShopId, itemId, count: passCount, token
            })
            .then(() => {
              setShowAddedPopup(false)
              setTimeout(() => setShowAddedPopup(true), 50)
              setUpdateCart(!updateCart)
            })
            .catch(err => err && console.log(err))
            .then(() => setTimeout(() => setShowAddedPopup(false), 1500))
        } else {
          const localShoppingCart = localStorage.getItem('shoppingCart')
          localStorage.removeItem('shoppingCart')
          const newShoppingCart = localShoppingCart ? [...JSON.parse(localShoppingCart), {shopId: passShopId, itemId, count: passCount}] : [{shopId: passShopId, itemId, count: passCount}]
          localStorage.setItem('shoppingCart', JSON.stringify(newShoppingCart))
          setShowAddedPopup(false)
          setUpdateCart(!updateCart)
          setTimeout(() => setShowAddedPopup(true), 50)
          setTimeout(() => setShowAddedPopup(false), 1500)
        }
      }

      return (
        <Col className={`pt-2 pb-2 ${(shopId === 'home' && i>1) && 'd-none'} ${(shopId === 'home' && i===2) && 'd-none d-lg-block'} ${(shopId === 'home' && i===3) && 'd-none d-xl-block'}`} style={{color: "whitesmoke", overflow:"hidden"}} xs={12} md={6} lg={4} xl={3} key={_id}>
          {showAddedPopup &&
            <Alert style={{position: "fixed", zIndex: '+9', top:156, right:0}} variant="success">
              Polozka bola pridana do kosika!
            </Alert>
          }
          <Card onMouseEnter={() => handleMouseOver(_id)} onTouchStart={() => handleMouseOver(_id)} onMouseLeave={() => handleMouseLeave()} style={{height: "410px", maxWidth: "300px"}} id={_id} >
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
            <img className="shop-item-img" style={{height: "407px"}} src={image} />
            <div style={{overflowY: 'hidden', color: "#333333", marginTop: "-110px" , backgroundColor: "rgba(255,255,255, 0.7)"}}>
              <Card.Title className="mt-1 mb-1">{itemName}</Card.Title>
              {(color && taste) && 
              <Card.Text className="mt-1 mb-1">{`${color[0].toUpperCase()}${color.substring(1).toLowerCase()}, ${taste[0].toUpperCase()}${taste.substring(1).toLowerCase()}`}</Card.Text>}
              <Card.Text className={`mt-1 mb-1 pb-4`}>{price} €</Card.Text>
            </div>
            <Card.ImgOverlay className={`${isHovered[_id] === 'block' ? 'fade-in' : 'fade-out'}`} style={{ background: "rgba(52,58,64,0.7)"}} >
                {isHovered[_id] === 'block' && hoverTimeout[_id] &&
                <Button style={{width: "100%"}} onClick={(e) => addItemToCart(e)} variant="dark">Pridať do košíka.</Button>}
                <Container>
                {isHovered[_id] === 'block' && hoverTimeout[_id] &&
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
                  </Row>}
                  {(isOwner && isHovered[_id] === 'block') && hoverTimeout[_id] &&
                  <Row>
                    <Col><a onClick={() => copyFunction(_id)} style={{textDecoration: 'none', cursor: 'pointer', color: clicked}}><strong>copy my id!</strong></a></Col>
                  </Row>}
                  {isHovered[_id] === 'block' && hoverTimeout[_id] &&
                  <Row style={{height: '240px', marginTop: '5px', marginBottom: '5px'}}>
                    <Col>{description}</Col>
                  </Row>}
                  {(url && isHovered[_id] === 'block') && hoverTimeout[_id] &&
                    <Link to={`/${url}`}>
                      <Button style={{width: "100%"}} variant="dark">Navštíviť vináreň.</Button>
                    </Link>
                  }
                </Container>
            </Card.ImgOverlay>
          </Card>
        </Col>
      );
    });
  };