import React, {useState, useEffect} from "react";
import { Link, useHistory } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import logo from "./logo5.png"

import {FiShoppingCart} from "react-icons/fi"
import {FaWineBottle} from "react-icons/fa"

// Navbar.js
export default ({ isLoggedIn, handleLogOut, shoppingCart, localShoppingCart = localStorage.getItem('shoppingCart'), updateCart }) => {
  let history = useHistory();
  const [prevScrollPos, setPrevScrollPos] = useState(0); 
  const [visible, setVisible] = useState(true);
  const [shoppingCartLength, setShoppingCartLength] = useState(0)
  const [shoppingHover, setShoppingHover] = useState(false)

  useEffect(() => {
    if (isLoggedIn && shoppingCart.length !== 0) {
      const counts = shoppingCart.map(item => Number(item.count))
      const finalCount = counts.reduce((total,x) => total+x)
      setShoppingCartLength(finalCount)
    } else if (!isLoggedIn && localShoppingCart) {
      const parsedCart = JSON.parse(localShoppingCart)
      const counts = parsedCart.map(item => Number(item.count))
      const finalCount = counts.reduce((total,x) => total+x)
      setShoppingCartLength(finalCount)
    } else {
      setShoppingCartLength(0)
    }
  }, [updateCart])

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
    backgroundColor: '#2b371b',
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
      setVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 250 );
    }
    setPrevScrollPos(currentScrollPos);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <>
      <div className="text-center w-100" style={{...logoStyles, top: visible ? '0' : '-169px'}}>
        <hr className="col-lg-2 col-md-3 d-none d-md-inline-block" style={{backgroundColor: 'whitesmoke', marginBottom: '-31px'}} />
        <img
          alt=""
          src={logo}
          width="auto"
          height="135"
          style={{marginTop: '-20px'}}
          
        />
        <hr className="col-lg-2 col-md-3 d-none d-md-inline-block" style={{backgroundColor: 'whitesmoke', marginBottom: '-31px'}} />
    </div>
    <Navbar collapseOnSelect className="justify-content-center" style={{...navbarStyles, top: visible ? '0' : '-169px', paddingTop: '100px'}} variant="dark" expand="md">
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
        <Nav style={{position: "absolute", right: 16, top: 16}}>
            <Nav.Link as={Link} href="/kosik" to="/kosik" className="navihover  pt-3 pb-3 mr-1 ml-1">
                {shoppingCartLength > 0 &&
                <div style={{ marginBottom: '-12px', marginLeft: '25px', fontSize: '60%', fontFamily: 'Cabin', width:'16px', height:'16px', borderRadius: '50%', backgroundColor: 'red'}}>
                  {shoppingCartLength.toString()}
                </div>}
                <FiShoppingCart />
            </Nav.Link>
          {isLoggedIn ? (
            <>
              <Nav.Link as={Link} href="/objednavky" to="/objednavky" className="navihover  pt-3 pb-3 mr-1 ml-1">
                  Objednávky
              </Nav.Link>
              <Nav.Link as={Link} href="" to="" onClick={() => handleLogOut()} className="navihover  pt-3 pb-3 mr-1 ml-1">
                Odhlásiť
              </Nav.Link>
            </>
          ) : (
            <Nav.Link as={Link} href="/login-page" to="/login-page" className="navihover pt-3 pb-3 mr-1 ml-1">
                Prihlásiť
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    {shoppingCartLength > 0 && 
      <div onClick={() => history.push(`/kosik`)} onMouseEnter={() => setShoppingHover(true)} onMouseLeave={() => setShoppingHover(false)} style={{cursor: 'pointer', color: shoppingHover ? "whitesmoke" : "#CF9D01", position: 'fixed', bottom: 35, right:35, width: "60px", height: "60px", backgroundColor: "rgba(245,245,245,0.4)", zIndex: '+9', borderRadius: '5px'}}>
        <div style={{ paddingLeft: '30px', fontSize: '150%', fontFamily: 'Cabin', width:'16px', height:'16px'}}>
            {shoppingCartLength.toString()}
        </div>
        <FiShoppingCart style={{height: '80%', width: '80%', margin: "10%" }} />
      </div>
    }
    </>
  );
};
