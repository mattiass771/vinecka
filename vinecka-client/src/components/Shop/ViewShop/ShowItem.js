import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import HISTAMIN_FREE from "./histamin_biela.png";

import axios from "axios";

import { MdDelete, MdEdit } from "react-icons/md";

import EditItems from "./EditItems";

const token = process.env.REACT_APP_API_SECRET

export default ({ shopItems, shopId, userId, setShouldReload, shouldReload, isOwner, url, setShoppingCart, shoppingCart}) => {
    const [count, setCount] = useState("")
    const [isHovered, setIsHovered] = useState("")
    const [clicked, setClicked] = useState('')
    const [editing, setEditing] = useState('')
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
      const { _id, itemName, price, description, imageLink, maxCount, color, taste, histamineFree, label } = item;
      const passShopId = shopId === 'home' ? item.shopId : shopId
      console.log(label)

      const image = getImage(imageLink)
        ? getImage(imageLink)
        : imageLink;

      const handleEditing = (e) => {
        const itemId = e.currentTarget.parentNode.id;
        let editingObj = {}
        editingObj[itemId] = true
        setEditing({...editing, ...editingObj})
      }

      const addItemToCart = (itemId) => {      
        console.log(shoppingCart.find(val => val.itemId === itemId && !val.label))
        console.log(shoppingCart)
        if (shoppingCart.find(val => val.itemId === itemId && !val.label)) {
          const newShoppingCart = shoppingCart.map(item => {
            if (item.itemId === itemId && !item.label) {                
                return {...item, count: item.count + 1}
            }
            return item
          })
          return setShoppingCart(newShoppingCart)
        } else {
          const newItem = { shopId: passShopId, itemId, count: 1 }
          setShoppingCart([...shoppingCart, newItem])
        }
      }

      const addLabeledItemToCart = (itemId, shopId = passShopId) => { 
        const itemLabelId = `${itemId}-${label._id}`       
        if (shoppingCart.find(val => val.itemId === itemLabelId)) {
          const newShoppingCart = shoppingCart.map(item => {
            if (item.itemId === itemLabelId) {                
                return {...item, count: item.count + 1}
            }
            return item
          })
          return setShoppingCart(newShoppingCart)
        } else {
          const newItem = { shopId, itemId: itemLabelId, label, count: 1 }
          setShoppingCart([...shoppingCart, newItem])
        }
    }

      return (
        <Col className={`pt-2 pb-2 ${(shopId === 'home' && i>1) && 'd-none'} ${(shopId === 'home' && i===2) && 'd-none d-lg-block'} ${(shopId === 'home' && i===3) && 'd-none d-xl-block'}`} style={{color: "whitesmoke", overflow:"hidden"}} xs={12} md={6} lg={4} xl={3} key={_id}>
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
            {histamineFree && 
              <img src={HISTAMIN_FREE} alt="histamin-free" style={{position: 'absolute', top: 0, right: 0}} />
            }
            {editing[_id] && <EditItems shouldReload={shouldReload} setShouldReload={setShouldReload} itemDataProp={item} showEditItems={editing[_id]} setShowEditItems={setEditing} shopId={passShopId} itemId={_id} />}
            <img className="shop-item-img" style={{height: "407px"}} src={image} />
            {label && 
            <img 
              src={getImage(label.imageLink)} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '26%'
              }}
            />}
            <div style={{overflowY: 'hidden', color: "#333333", marginTop: "-110px" , backgroundColor: "rgba(255,255,255, 0.7)"}}>
              <Card.Title className="mt-1 mb-1" style={{minHeight: '2em'}}>{itemName}</Card.Title>
              {(color && taste) && 
              <Card.Text className="mt-1 mb-1">{`${color[0].toUpperCase()}${color.substring(1).toLowerCase()}, ${taste[0].toUpperCase()}${taste.substring(1).toLowerCase()}`}</Card.Text>}
              <Card.Text className={`mt-1 mb-1 pb-4`}>{price} €</Card.Text>
            </div>
            <Card.ImgOverlay className={`${isHovered[_id] === 'block' ? 'fade-in' : 'fade-out'}`} style={{ background: "rgba(52,58,64,0.7)"}} >
                {(url && isHovered[_id] === 'block') && hoverTimeout[_id] &&
                  <Link to={`/${url}`}>
                    <Button style={{width: "100%"}} variant="dark">Navštíviť vináreň.</Button>
                  </Link>
                }
                <Container>
                  {(isOwner && isHovered[_id] === 'block') && hoverTimeout[_id] &&
                  <Row>
                    <Col><a onClick={() => copyFunction(_id)} style={{textDecoration: 'none', cursor: 'pointer', color: clicked}}><strong>copy my id!</strong></a></Col>
                  </Row>}
                  {isHovered[_id] === 'block' && hoverTimeout[_id] &&
                  <Row style={{height: '290px', marginTop: '5px', marginBottom: '5px', fontSize: '95%', overflowY: 'scroll'}}>
                    <Col>{description}</Col>
                  </Row>}
                  {isHovered[_id] === 'block' && hoverTimeout[_id] &&
                  <Button style={{width: "100%"}} onClick={() => label ? addLabeledItemToCart(_id, passShopId) : addItemToCart(_id)} variant="dark">Pridať do košíka.</Button>}
                </Container>
            </Card.ImgOverlay>
          </Card>
        </Col>
      );
    });
  };