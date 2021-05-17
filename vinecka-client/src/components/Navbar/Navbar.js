import React, {useState, useEffect} from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from 'axios'

import DiscountBar from '../../DiscountBar'

import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

import logo from "./logo5.png"

import { FiShoppingCart } from "react-icons/fi"

const envComerStamp = process.env.REACT_APP_NEWCOMER_STAMP
const token = process.env.REACT_APP_API_SECRET

// Navbar.js
export default ({ userId, userName, newComerStamp, isLoggedIn, handleLogOut, shoppingCart }) => {
  const firstName = userName ? userName.split(' ') : ['Používateľ']
  let history = useHistory();
  let location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(0); 
  const [visible, setVisible] = useState(true);
  const [shoppingCartLength, setShoppingCartLength] = useState(999)
  const [showAlert, setShowAlert] = useState(false)
  const [shops, setShops] = useState([])

  const getImage = (image) => {
    try {
      const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
      return img;
    } catch {
      return null;
    }
  }

  const triggerLogout = () => {
    handleLogOut()
  }

  const limit = Math.max( 
    document.body.scrollHeight, 
    document.body.offsetHeight, 
    document.documentElement.clientHeight, 
    document.documentElement.scrollHeight, 
    document.documentElement.offsetHeight 
  );


  const navbarStyles = {
    position: 'fixed',
    transition: 'top 0.6s',
    width: '100%',
    zIndex: '+2',
    backgroundColor: '#141a10',
    fontSize: '120%'
  }

  const logoStyles = {
    position: 'fixed',
    transition: 'top 0.6s',
    zIndex: '+3',
    pointerEvents: 'none'
  }

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if ((limit - currentScrollPos) < 1750 && currentScrollPos > 250) setVisible(false)
    else {
      setVisible(currentScrollPos < 250 );
    }
    setPrevScrollPos(currentScrollPos);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  useEffect(() => {
    if (shoppingCart.length !== 0) {
      const counts = shoppingCart.map(item => Number(item.count))
      const finalCount = counts.reduce((total,x) => total+x)
      if (finalCount > shoppingCartLength) {
        setShowAlert(true)
      } else {
        setShowAlert(false)
      }
      setShoppingCartLength(finalCount)
    } else {
      setShowAlert(false)
      setShoppingCartLength(0)
      setShops([])
    }
    if (location.pathname !== '/kosik') {
      if (shops.length === 0) {
        let sortShop = []
        shoppingCart.map(cartItem => {
          axios.post(`${process.env.REACT_APP_BACKEND_URL}/shop/get-shop/${cartItem.shopId}`, {token})
            .then((res) => {
                if (res.data && res.data.shopName) {
                    const { shopName, owner } = res.data
                    const itemsArr = res.data.shopItems
                    const { count, itemId } = cartItem
                    const findItem = itemsArr.find(el => el._id === cartItem.itemId)
                    if (findItem === undefined) {
                        axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/cart/delete-cart-item/${cartItem.shopId}/${cartItem.itemId}`, {token})
                            .then((res) => console.log(res))
                            .catch(err => err && console.log('could not delete item', err))
                    } else {
                        const { itemName, price, imageLink } = findItem
                        const index = sortShop.findIndex(el => el.shopId === cartItem.shopId)
                        if (index >= 0) {
                            const prevItems = sortShop[index].itemData
                            const isInCart = prevItems.findIndex(el => el.itemId === itemId)
                            if (isInCart !== -1) {
                                const prevCount = sortShop[index].itemData[isInCart].count
                                sortShop[index].itemData[isInCart].count = Number(count) + Number(prevCount)
                            } else {
                                sortShop[index].itemData = [...prevItems, {itemId, itemName, price, imageLink, count}]
                            }
                        } else {
                            const newShopId = cartItem.shopId
                            sortShop = [...sortShop, {shopId: newShopId, shopName, owner, itemData: [{itemId, itemName, price, imageLink, count}]}]
                        }
                    }
                }
            })
            .catch(err => {
                if (err) return console.log(err)
            })
            .then(() => {
                setShops([...sortShop])
            })
        })
      } else {
        const cartItem = shoppingCart[shoppingCart.length-1]
        let sortShop = [...shops]
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/shop/get-shop/${cartItem.shopId}`, {token})
            .then((res) => {
                if (res.data && res.data.shopName) {
                    const { shopName, owner } = res.data
                    const itemsArr = res.data.shopItems
                    const { count, itemId } = cartItem
                    const findItem = itemsArr.find(el => el._id === cartItem.itemId)
                    if (findItem === undefined) {
                        axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/cart/delete-cart-item/${cartItem.shopId}/${cartItem.itemId}`, {token})
                            .then((res) => console.log(res))
                            .catch(err => err && console.log('could not delete item', err))
                    } else {
                        const { itemName, price, imageLink } = findItem
                        const index = sortShop.findIndex(el => el.shopId === cartItem.shopId)
                        if (index >= 0) {
                            const prevItems = sortShop[index].itemData
                            const isInCart = prevItems.findIndex(el => el.itemId === itemId)
                            if (isInCart !== -1) {
                                const prevCount = sortShop[index].itemData[isInCart].count
                                sortShop[index].itemData[isInCart].count = Number(count) + Number(prevCount)
                            } else {
                                sortShop[index].itemData = [...prevItems, {itemId, itemName, price, imageLink, count}]
                            }
                        } else {
                            const newShopId = cartItem.shopId
                            sortShop = [...sortShop, {shopId: newShopId, shopName, owner, itemData: [{itemId, itemName, price, imageLink, count}]}]
                        }
                    }
                }
            })
            .catch(err => {
                if (err) return console.log(err)
            })
            .then(() => {
                setShops([...sortShop])
            })
      }
    }
  }, [shoppingCart])

  const showCartItems = () => {
    return shops.sort((a, b) => (a.shopName > b.shopName) - (a.shopName < b.shopName)).map(shop => {
      const {shopName, itemData} = shop
      return itemData.map(item => {
        const {itemId, itemName, price, imageLink, count} = item
        return (
          <Row style={{fontSize: '80%'}} className="m-2" key={itemId}>
            <Col xs={2}><img src={getImage(imageLink)} style={{height: '60px', width: '40px'}} /></Col>
            <Col xs={6}><strong>{itemName}</strong><br />{shopName}</Col>
            <Col xs={2}>{price}€</Col>
            <Col xs={2}>{count}x</Col>
          </Row>
        )
      })
    })
  }

  return (
    <>
      {
        newComerStamp === envComerStamp &&
        <DiscountBar visible={visible} />
      }
      <div className="text-center w-100" style={{...logoStyles, top: visible ? '20px' : '-90px'}}>
        <hr className="col-lg-3 col-md-3 d-none d-md-inline-block" style={{backgroundColor: '#fab20f', marginBottom: '-22px'}} />
        <img
          alt=""
          src={logo}
          width="auto"
          height="100"
          style={{marginTop: '-20px'}}
          
        />
        <hr className="col-lg-3 col-md-3 d-none d-md-inline-block" style={{backgroundColor: '#fab20f', marginBottom: '-22px'}} />
    </div>
    <Navbar collapseOnSelect className="justify-content-center" style={{...navbarStyles, top: visible ? '0' : '-90px', paddingTop: '95px'}} variant="dark" expand="md">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="row justify-content-center text-center">
        <Nav className="my-4 my-md-0">
          <Nav.Link as={Link} href="/" to="/" className="navihover  pt-4 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1">
              Domov
          </Nav.Link>

          <Nav.Link as={Link} href="/vinarstva" to="/vinarstva" className="navihover  pt-4 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1">
              Vinárstva
          </Nav.Link>

          <Nav.Link as={Link} href="/vina" to="/vina" className="navihover  pt-4 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1">
              Vína
          </Nav.Link>

          <Nav.Link as={Link} href="/eventy" to="/eventy" className="navihover  pt-4 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1">
              Eventy
          </Nav.Link>

          <Nav.Link as={Link} href="/sluzby" to="/sluzby" className="navihover  pt-4 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1">
              Služby
          </Nav.Link>

          <Nav.Link as={Link} href="/kontakt" to="/kontakt" className="navihover  pt-4 pb-3 mr-xl-4 ml-xl-4 mr-lg-2 ml-lg-2 mr-1 ml-1">
              Kontakt
          </Nav.Link>
        </Nav>
        {visible ? 
          <Nav className={`navi-user`}>
              <Nav.Link as={Link} href="/kosik" to="/kosik" className={`navihover pt-3 pb-3 mr-1 ml-1 `}>
                  {shoppingCartLength > 0 &&
                  <div style={{ marginBottom: '-12px', marginLeft: '25px', fontSize: '60%', fontFamily: 'Montserrat', width:'16px', height:'16px', borderRadius: '50%', backgroundColor: 'red'}}>
                    {shoppingCartLength.toString()}
                  </div>}
                  <FiShoppingCart />
              </Nav.Link>
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} href="/objednavky" to="/objednavky" className="navihover pt-3 pb-3 mr-1 ml-1">
                    Objednávky
                </Nav.Link>
                <Nav.Link as={Link} href="" to="" onClick={() => triggerLogout()} className="navihover  pt-3 pb-3 mr-1 ml-1">
                  Odhlásiť
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} href="/login-page" to="/login-page" className="navihover pt-3 pb-3 mr-1 ml-1">
                  Prihlásiť
              </Nav.Link>
            )}
          </Nav> :
          <>
            <Nav className={`navi-user-folded d-none d-md-block`} >
              <NavDropdown variant="light" title={
                  <span className={`navihover`}>{firstName[0]}</span>
                } id="nav-dropdown" style={{zIndex: '+299'}}>
                <Nav.Link as={Link} href="/kosik" to="/kosik" className={`navidown`}>
                    {shoppingCartLength > 0 &&
                    <div style={{ color:'whitesmoke', marginBottom: '-12px', marginLeft: '25px', fontSize: '80%', fontFamily: 'Cabin', width:'16px', height:'16px', borderRadius: '50%', backgroundColor: 'red'}}>
                      &nbsp;{shoppingCartLength.toString()}
                    </div>}
                    <FiShoppingCart />
                </Nav.Link>
                {isLoggedIn ? (
                  <>
                    <Nav.Link as={Link} href="/objednavky" to="/objednavky" className="navidown">
                        Objednávky
                    </Nav.Link>
                    <Nav.Link as={Link} href="" to="" onClick={() => triggerLogout()} className="navidown">
                      Odhlásiť
                    </Nav.Link>
                  </>
                ) : (
                  <Nav.Link as={Link} href="/login-page" to="/login-page" className="navidown">
                      Prihlásiť
                  </Nav.Link>
                )}
              </NavDropdown>
            </Nav>
            <Nav className={`navi-user d-md-none`}>
                <Nav.Link as={Link} href="/kosik" to="/kosik" className={`navihover pt-3 pb-3 mr-1 ml-1 `}>
                    {shoppingCartLength > 0 &&
                    <div style={{ marginBottom: '-12px', marginLeft: '25px', fontSize: '60%', fontFamily: 'Montserrat', width:'16px', height:'16px', borderRadius: '50%', backgroundColor: 'red'}}>
                      {shoppingCartLength.toString()}
                    </div>}
                    <FiShoppingCart />
                </Nav.Link>
              {isLoggedIn ? (
                <>
                  <Nav.Link as={Link} href="/objednavky" to="/objednavky" className="navihover pt-3 pb-3 mr-1 ml-1">
                      Objednávky
                  </Nav.Link>
                  <Nav.Link as={Link} href="" to="" onClick={() => triggerLogout()} className="navihover  pt-3 pb-3 mr-1 ml-1">
                    Odhlásiť
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} href="/login-page" to="/login-page" className="navihover pt-3 pb-3 mr-1 ml-1">
                    Prihlásiť
                </Nav.Link>
              )}
            </Nav>
          </>
        }
      </Navbar.Collapse>
    </Navbar>
    {(shoppingCartLength > 0 && location.pathname !== '/kosik') && 
      <Alert 
        className={`${showAlert ? 'fade-in-alert' : 'fade-out-alert'}`}
        style={{
          backgroundColor: "whitesmoke", 
          position: "fixed", 
          top: '21vh', 
          right: 0,
          zIndex: "+999", 
          maxHeight: '78vh', 
          overflowY: 'scroll',
        }} 
        onClose={() => setShowAlert(false)} 
        dismissible
      >
        <Container className="d-none d-lg-block" style={{fontSize: '80%', maxHeight: '68vh', overflowY: 'scroll'}}>
          {showCartItems()}
        </Container>
        <Container className="d-block d-lg-none" style={{fontSize: '110%'}}>
          <Row>
            Víno bolo pridané do košíka.
          </Row>
        </Container>
        <Container className="mt-2">
          <Row>
            <Button variant="dark" onClick={() => history.push('/kosik')}>Prejsť do košíka.</Button>
          </Row>
        </Container>
      </Alert>
    }
    </>
  );
};
