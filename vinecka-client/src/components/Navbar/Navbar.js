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

import { FiShoppingCart, FiPlusSquare, FiMinusSquare } from "react-icons/fi"

const envComerStamp = process.env.REACT_APP_NEWCOMER_STAMP
const token = process.env.REACT_APP_API_SECRET

// Navbar.js
export default ({ userId, userName, newComerStamp, isLoggedIn, handleLogOut, shoppingCart, setShoppingCart }) => {
  const firstName = userName ? userName.split(' ') : ['Používateľ']
  let history = useHistory();
  let location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(0); 
  const [visible, setVisible] = useState(true);
  const [shoppingCartLength, setShoppingCartLength] = useState(999)
  const [showAlert, setShowAlert] = useState(false)
  const [shops, setShops] = useState([])
  const [oldCart, setOldCart] = useState([])

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
      const counts = shoppingCart.map(item => (item !== null && item !== undefined) && Number(item.count))
      const finalCount = counts.reduce((total,x) => total+x)
      setShowAlert(true)
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
                setOldCart(shoppingCart)
            })
        })
      } else {
        const toUpdate = shoppingCart.filter(newItem => {
          const firstCondition = oldCart.some(oldItem => (oldItem.itemId === newItem.itemId && oldItem.shopId === newItem.shopId && oldItem.count !== newItem.count))
          const secondCondition = oldCart.some(oldItem => oldItem.itemId === newItem.itemId)
          if (firstCondition || !secondCondition) {
            return newItem
          }
        })
        let sortShop = []  
        const cartItem = toUpdate[0]
        if (cartItem) {
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
              let found = false
              const newShops = shops.map(shop => {
                if (shop.shopId === sortShop[0].shopId) {
                  const newItemData = shop.itemData.map(item => {
                    if (item.itemId === sortShop[0].itemData[0].itemId) {
                      found = true
                      return sortShop[0].itemData[0]
                    } else return item
                  })
                  return {...shop, itemData: newItemData}
                } else return shop
              })
              setShops(found ? [...newShops] : [...shops, ...sortShop])
              setOldCart(shoppingCart)
            })
        }
      }
    }
  }, [shoppingCart])

  const removeItemFromCart = (itemId) => {
    const newShoppingCart = shoppingCart.filter(item => item.itemId !== itemId)
    setShoppingCart(newShoppingCart.filter(cart => cart !== null && cart !== undefined))
    if (newShoppingCart.length !== 0) {
        const newShops = shops.map(shop => {
            const newItemData = shop.itemData.filter(item => item.itemId !== itemId)
            if (newItemData.length !== 0) {
                return {...shop, itemData: newItemData}
            } else {
                return;
            }
        })
        setShops(newShops.filter(shop => shop !== undefined))
    } else {
        setShops([])
    }
}

  const substractItemFromCart = (itemId) => {
    const newShoppingCart = shoppingCart.map(item => {
        if (item.itemId === itemId) {
            if (item.count === 1) {
                return removeItemFromCart(itemId)
            }
            return {...item, count: item.count - 1}
        }
        return item
    })
    setShoppingCart(newShoppingCart.filter(cart => cart !== null && cart !== undefined))
    if (newShoppingCart.length !== 0) {
        const newShops = shops.map(shop => {
            const newItemData = shop.itemData.map(item => {
                if (item.itemId === itemId) {
                    return {...item, count: item.count - 1}
                }
                return item
            })
            if (newItemData.length !== 0) {
                return {...shop, itemData: newItemData}
            } else {
                return;
            }
        })
        setShops(newShops.filter(shop => shop !== undefined))
    } else {
        setShops([])
    }
}

const incrementItemFromCart = (itemId) => {
    const newShoppingCart = shoppingCart.map(item => {
        if (item.itemId === itemId) {
            return {...item, count: item.count + 1}
        }
        return item
    })
    setShoppingCart(newShoppingCart.filter(cart => cart !== null && cart !== undefined))
    if (newShoppingCart.length !== 0) {
        const newShops = shops.map(shop => {
            const newItemData = shop.itemData.map(item => {
                if (item.itemId === itemId) {
                    return {...item, count: item.count + 1}
                }
                return item
            })
            if (newItemData.length !== 0) {
                return {...shop, itemData: newItemData}
            } else {
                return;
            }
        })
        setShops(newShops.filter(shop => shop !== undefined))
    } else {
        setShops([])
    }
}

  const ShowCartItems = () => {
    return shops.sort((a, b) => (a.shopName > b.shopName) - (a.shopName < b.shopName)).map(shop => {
      const {shopName, itemData} = shop
      return itemData.map(item => {
        const {itemId, itemName, price, imageLink, count} = item
        if (count > 0) {
          return (
            <Row style={{fontSize: '80%'}} className="m-2" key={itemId}>
              <Col xs={2}><img src={getImage(imageLink)} style={{height: '60px', width: '40px'}} /></Col>
              <Col xs={6}><strong>{itemName}</strong><br />{shopName}</Col>
              <Col xs={2}>{price}€</Col>
              <Col xs={2}>
                {count}x
                &nbsp;
                <FiPlusSquare style={{cursor: 'pointer' ,position: 'absolute', top: 0}} onClick={() => incrementItemFromCart(itemId)} />
                <FiMinusSquare style={{cursor: 'pointer' ,position: 'absolute', top: 10}} onClick={() => substractItemFromCart(itemId)} />            
              </Col>
            </Row>
          )
        } else return;
      })
    })
  }

  const showTotalPrice = () => {
    let result = 0
    shops.map(shop => (shop.itemData).map(item => result += (Number((item.price).replace(/,/g,"."))*item.count)))
    return result.toFixed(2).replace(/\./, ',')
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
          top: visible ? '164px' : '74px', 
          right: 0,
          zIndex: "+999", 
          maxHeight: '40vh', 
          padding: '20px 0px 0px 0px',
          overflowY: 'scroll',
          transition: 'top 0.6s',
        }} 
        onClose={() => setShowAlert(false)} 
        dismissible
      >
        <Container className="d-none d-lg-block" style={{fontSize: '80%', maxHeight: '30vh', overflowY: 'scroll'}} fluid>
          <ShowCartItems />
        </Container>
        <Container className="d-block d-lg-none" style={{fontSize: '110%', margin: '20px'}} fluid>
          <Row>
            Víno bolo pridané do košíka.
          </Row>
        </Container>
        <Container className="mt-2" fluid>
          <Row className="justify-content-between text-left">
            <Col>
              <Button variant="dark" onClick={() => history.push('/kosik')}>Prejsť do košíka.</Button>
            </Col>
            <Col>
              Spolu: <strong>{showTotalPrice()} €</strong>
            </Col>
          </Row>
        </Container>
      </Alert>
    }
    </>
  );
};
