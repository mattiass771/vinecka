import React, { useState, useEffect } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import axios from "axios";

import "./index.css";
import "react-dropzone-uploader/dist/styles.css";

import Home from "./components/Home/Home";
import Vinarne from "./components/Shop/Vinarne";
import Login from "./components/Login/Login";
import ChangePassword from "./components/Login/ChangePassword";
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
import CookiesPopup from './components/Law/CookiesPopup'
import MaintenanceModePage from './components/MaintenanceMode/MaintenanceModePage'
import LabelGenerator from './components/Labels/LabelGenerator'

import emailjs from 'emailjs-com';

import Spinner from "react-bootstrap/Spinner";

const token = process.env.REACT_APP_API_SECRET

// App.jss
export default () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [showLawPopup, setShowLawPopup] = useState('')
  const [shoppingCart, setShoppingCart] = useState([])
  const [isMaintenance, setIsMaintenance] = useState(false)

  useEffect(() => {
    emailjs.init(process.env.REACT_APP_EMAILJS_USERID);
    setLoadingData(true)
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/get-user-data`, {token}, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          const { _id, userName, fullName, email, shopId, isOwner, newComerStamp } = res.data;
          setUserData({ _id, userName, fullName, email, shopId, isOwner, newComerStamp });
          setIsLoggedIn(userName ? true : false);
        } else {
          setUserData({})
        }
      })
      .catch((err) => err && console.log("Load Error " + err))
      .then(() => setLoadingData(false))
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/home/check-maintenance`, {token})
      .then(res => setIsMaintenance(res.data))
      .catch(err => console.log(err))
  }, []);

  useEffect(() => {
    if (userData._id) {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/${userData._id}/cart/`, {token})
        .then(res => {
          const localCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]')
          const userCart = res.data
          const syncCarts = localCart.length !== 0 ? [...localCart] : [...userCart]
          const filteredCart = syncCarts.filter(cart => cart !== null && cart !== undefined)
          setShoppingCart(filteredCart)
        })
        .catch(err => console.log('error updating shopping cart...', err))
    } else {
      const localCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]')
      const filteredCart = localCart.filter(cart => cart !== null && cart !== undefined)
      setShoppingCart(filteredCart)
    }
  }, [userData])

  useEffect(() => {
    const filteredCart = shoppingCart.filter(cart => cart !== null && cart !== undefined)
    localStorage.setItem('shoppingCart', JSON.stringify(filteredCart))
    if (userData._id) {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/${userData._id}/update-cart/`, {newCart: filteredCart, token})
        .then(res => console.log('shopping cart was successfuly updated: ', res.data))
        .catch(err => console.log('error updating shopping cart...', err))
    }
  }, [shoppingCart])

  const handleLogOut = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/logout`, {token}, {
        withCredentials: true,
      })
      .then(() => {
        setUserData({});
        setIsLoggedIn(false);
      })
      .catch((err) => console.log(`Error ${err}`))
      .then(() => window.location.reload());
  };

  userData.isOwner = true

  return (
    <Router>
      <CookiesPopup setShowLawPopup={setShowLawPopup} />
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
        <Navbar isOwner={userData.isOwner} userId={userData._id} userName={userData.fullName} newComerStamp={userData.newComerStamp} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} isLoggedIn={isLoggedIn} handleLogOut={handleLogOut} />
        {loadingData ? 
              <Spinner
                style={{ marginLeft: "49%", marginTop: "20%", color: 'whitesmoke' }}
                animation="border"
              /> :
        <div className="wrapper">
          <Switch>
            <Route exact path="/">
              <Home isMaintenance={isMaintenance} userId={userData._id} isOwner={userData.isOwner} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart}  />
            </Route>
            <Route exact path="/vinarstva">
              <Vinarne userData={userData} />
            </Route>
            <Route exact path="/vina">
              {isMaintenance ?
                <MaintenanceModePage /> : 
                <Vinka userData={userData} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />
              }
            </Route>
            <Route exact path="/login-page">
              {isLoggedIn ? <Home userId={userData._id} isOwner={userData.isOwner} /> : <Login />}
            </Route>
            <Route exact path="/kosik">
              {isMaintenance ?
                <MaintenanceModePage /> : 
                <ShoppingCart shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} newComerStamp={userData.newComerStamp} userId={userData._id} />
              }
            </Route>
            <Route exact path={`/success-payment`}>
              <SuccessPayment userId={userData._id} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />
            </Route>
                <Route exact path={`/failed-payment`}>
              <RejectPayment userId={userData._id} />
            </Route>
            <Route exact path={`/cancel-payment`}>
              <RejectPayment userId={userData._id} />
            </Route>
            <Route exact path={`/objednavky`}>
              {isLoggedIn ? 
              <Orders email={userData.email} isOwner={userData.isOwner} /> :
              <Login />
              }
            </Route>
            <Route exact path={`/eventy`}>
              <Events isOwner={userData.isOwner} />
            </Route>
            <Route exact path={`/etikety`}>
              <LabelGenerator isOwner={userData.isOwner} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />
            </Route>
            <Route exact path={`/kontakt`}>
              <Contact userId={userData._id} isOwner={userData.isOwner} />
            </Route>
            <Route exact path={`/odhlasit-newsletter`}>
              <DeleteFromNewsletter />
            </Route>
            <Route exact path={`/zmena-hesla`}>
              <ChangePassword />
            </Route>
            <Route exact path={`/:shopUrl`}>
              <ShopOnline isMaintenance={isMaintenance} userId={userData._id} isOwner={userData.isOwner} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} />
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
