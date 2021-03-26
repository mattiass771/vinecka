import React, { useState, useEffect } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import axios from "axios";

import "./index.css";
import "react-dropzone-uploader/dist/styles.css";

import Home from "./components/Home/Home";
import Vinarne from "./components/Shop/Vinarne";
import Login from "./components/Login/Login";
import ShopOnline from "./components/Shop/shopOnline/ShopOnline"
import ShoppingCart from "./components/Cart/ShoppingCart"
import PayGate from "./components/Cart/PayGate"
import Orders from "./components/Payment/Orders"
import SuccessPayment from "./components/Payment/SuccessPayment";
import RejectPayment from "./components/Payment/RejectPayment";
import Vinka from "./components/Wines/Vinka";
import Events from "./components/Events/Events";
import Services from "./components/Services/Services";
import Footer from "./components/Footer";
import AdultModal from './AdultModal';
import Contact from './components/Contact/Contact';
import DeleteFromNewsletter from './components/Contact/DeleteFromNewsletter';
import Popup from './components/Law/Popup';

import Spinner from "react-bootstrap/Spinner";

// App.js
export default () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [showLawPopup, setShowLawPopup] = useState('')
  const [updateCart, setUpdateCart] = useState(true)
  

  useEffect(() => {
    setLoadingData(true)
    axios
      .get(`https://mas-vino.herokuapp.com/get-user-data`, {
        withCredentials: true
      })
      .then((res) => {
        if (res.data) {
          const { _id, userName, fullName, email, shopId, isOwner, shoppingCart } = res.data;
          setUserData({ _id, userName, fullName, email, shopId, isOwner, shoppingCart });
          setIsLoggedIn(userName ? true : false);
        } else {
          setUserData({})
        }
      })
      .catch((err) => err && console.log("Load Error " + err))
      .then(() => setLoadingData(false))
  }, []);
  const handleLogOut = () => {
    axios
      .get(`https://mas-vino.herokuapp.com/logout`, {
        withCredentials: true
      })
      .then(() => {
        setUserData({});
        setIsLoggedIn(false);
      })
      .catch((err) => console.log(`Error ${err}`))
      .then(() => window.location.reload());
  };
  
  return (
    <Router>
      {window.localStorage.getItem('mas-vino-isAdult') !== "true" &&
        <AdultModal initShow={true} />
      }
      {
        showLawPopup !== '' && <Popup showLawPopup={showLawPopup} setShowLawPopup={setShowLawPopup} />
      }
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossOrigin="anonymous"
      />
      <div>
        <Navbar updateCart={updateCart} shoppingCart={userData.shoppingCart} isLoggedIn={isLoggedIn} handleLogOut={handleLogOut} />
        {loadingData ? 
              <Spinner
                style={{ marginLeft: "49%", marginTop: "20%", color: 'whitesmoke' }}
                animation="border"
              /> :
        <div className="wrapper">
          <Switch>
            <Route exact path="/">
              <Home userId={userData._id} isOwner={userData.isOwner} updateCart={updateCart} setUpdateCart={setUpdateCart}  />
            </Route>
            <Route exact path="/vinarstva">
              <Vinarne userData={userData} />
            </Route>
            <Route exact path="/vina">
              <Vinka userData={userData} updateCart={updateCart} setUpdateCart={setUpdateCart} />
            </Route>
            <Route exact path="/login-page">
              {isLoggedIn ? <Home userId={userData._id} isOwner={userData.isOwner} /> : <Login />}
            </Route>
            <Route exact path="/kosik">
              <ShoppingCart updateCart={updateCart} setUpdateCart={setUpdateCart} userId={userData._id} />
            </Route>
            <Route exact path={`/success-payment`}>
              <SuccessPayment userId={userData._id} />
            </Route>
                <Route exact path={`/failed-payment`}>
              <RejectPayment userId={userData._id} />
            </Route>
            <Route exact path={`/cancel-payment`}>
              <RejectPayment userId={userData._id} />
            </Route>
            <Route exact path={`/objednavky`}>
              <Orders userId={userData._id} isOwner={userData.isOwner} />
            </Route>
            <Route exact path={`/eventy`}>
              <Events isOwner={userData.isOwner} />
            </Route>
            <Route exact path={`/sluzby`}>
              <Services isOwner={userData.isOwner} />
            </Route>
            <Route exact path={`/kontakt`}>
              <Contact />
            </Route>
            <Route exact path={`/odhlasit-newsletter`}>
              <DeleteFromNewsletter />
            </Route>
            <Route exact path={`/:shopUrl`}>
              <ShopOnline userId={userData._id} isOwner={userData.isOwner} updateCart={updateCart} setUpdateCart={setUpdateCart} />
            </Route>
            <Route exact path={`/shop/payment`}>
              <PayGate />
            </Route>
          </Switch>
        </div>}
        <Footer showLawPopup={showLawPopup} setShowLawPopup={setShowLawPopup} />
      </div>    
    </Router>
  );
};
