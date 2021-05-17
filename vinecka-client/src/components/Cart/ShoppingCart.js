import React, { useEffect, useState, useRef } from "react"
import {Link, useHistory} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Spinner from "react-bootstrap/Spinner"
import Alert from "react-bootstrap/Alert"

import PlaceOrder from './PlaceOrder'
import SignUp from '../Login/SignUp'
import Login from '../Login/Login'
import PayGate from './PayGate'
import DeliveryOptions from './DeliveryOptions'
import PaymentOptions from './PaymentOptions'

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

const token = process.env.REACT_APP_API_SECRET
const envComerStamp = process.env.REACT_APP_NEWCOMER_STAMP

const deliveryOptions = {
    OSOBNY: 'osobny',
    ROZVOZ: 'rozvoz',
    ROZVOZ_FIRST: 1.50,
    ROZVOZ_SECOND: 2.10,
    ZASIELKOVNA: 'zasielkovna',
    ZASIELKOVNA_PRICE: 2.90,
    KURIER: 'kurier',
    KURIER_PRICE: 4.50,
}

const paymentOptions = {
    KARTA: 'karta', 
    INTERNET_BANKING: 'internet-banking', 
    PREVOD: 'prevod', 
    DOBIERKA: 'dobierka'
}

export default ({userId, shoppingCart, setShoppingCart, newComerStamp}) => {
    let history = useHistory()
    const { OSOBNY, ROZVOZ, ROZVOZ_FIRST, ROZVOZ_SECOND, ZASIELKOVNA, ZASIELKOVNA_PRICE, KURIER, KURIER_PRICE } = deliveryOptions
    const { DOBIERKA, PREVOD, INTERNET_BANKING, KARTA } = paymentOptions
    const lastRef = useRef(null)
    const [shops, setShops] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [userInformation, setUserInformation] = useState('')
    const [login, setLogin] = useState(false)
    const [registration, setRegistration] = useState(false)
    const [shipmentOnly, setShipmentOnly] = useState(true)
    const [loading, setLoading] = useState(false)
    const [orderId, setOrderId] = useState(moment().unix())
    const [passOrderInfo, setPassOrderInfo] = useState({})
    const [paymentPopup, setPaymentPopup] = useState(false)  
    const [checkedNewsletter, setCheckedNewsletter] = useState(false)
    const [deliveryCheck, setDeliveryCheck] = useState(sessionStorage.getItem('deliveryCheck') || '')
    const [isDeliveryFree, setIsDeliveryFree] = useState(false)
    const [localDeliveryPrice, setLocalDeliveryPrice] = useState('')
    const [newUser, setNewUser] = useState(false)
    const [uncheckGdpr, setUncheckGdpr] = useState(false)
    const [regSuccess, setRegSuccess] = useState(false)
    const [paymentCheck, setPaymentCheck] = useState(sessionStorage.getItem('paymentCheck') || '')
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [orderProcessing, setOrderProcessing] = useState(false)
    const [discount, setDiscount] = useState('')
    const [isValidDiscount, setIsValidDiscount] = useState('')

    const [selectedPickupPoint, setSelectedPickupPoint] = useState('')

    const executeScroll = () => lastRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })   

    const handleSessionStorage = (customKey, value) => {
        return sessionStorage.setItem(customKey, value)
    }

    useEffect(() => {
        const {address} = userInformation;
        if (address) {
            if (address.match(/[šs]enkvice/ig) || address.match(/modra/ig) || address.match(/dubov[aá]/ig) || address.match(/sv[aä]t[yý][ ]{0,9}[jur]/ig) || address.match(/slovensk[yý][ ]{0,9}grob/ig) || address.match(/bratislava/ig) || address.match(/[čc]iern[aá][ ]{0,9}voda/ig)) { 
                if (!localDeliveryPrice) {
                    setLocalDeliveryPrice(ROZVOZ_SECOND)
                }
            } else if (address.match(/pezin[oe]k/ig) || address.match(/vinosady/ig) || address.match(/limbach/ig) || address.match(/vi[nň]i[čc]n[é]/ig)) {
                if (!localDeliveryPrice) {
                    setLocalDeliveryPrice(ROZVOZ_FIRST)
                }
            } else {
                if (localDeliveryPrice) {
                    setLocalDeliveryPrice('')
                }
            }
        }
    }, [userInformation])

    useEffect(() => {
        sessionStorage.setItem('deliveryCheck', deliveryCheck)
    }, [deliveryCheck])

    useEffect(() => {
        sessionStorage.setItem('paymentCheck', paymentCheck)
    }, [paymentCheck])
 
    const sortItems = (cartItems) => {
        let sortShop = []
        for (let cartItem of cartItems) {
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
                    setLoading(false)
                })
        }
    }

    useEffect(() => {
        setLoading(false)
        sortItems(shoppingCart)
    }, [])

    useEffect(() => {
        setIsDeliveryFree(false)
        if (userId) {
            axios
                .post(`${process.env.REACT_APP_BACKEND_URL}/users/get-user/${userId}`, {token})
                .then((res) => {
                    if (res.data) {
                        const {fullName, email, phone, address} = res.data
                        setUserInformation({ fullName, email, phone, address })
                        const splitAddress = address.split(',')
                        const splitName = fullName.split(' ')
                        handleSessionStorage('firstName', splitName[0])
                        handleSessionStorage('lastName', splitName[1])
                        handleSessionStorage('email', email)
                        handleSessionStorage('phone', phone)
                        handleSessionStorage('city', splitAddress[2])
                        handleSessionStorage('postal', splitAddress[1])
                        handleSessionStorage('street', splitAddress[0])
                    }
                })
                .catch(err => err && console.log(err))
                .then(() => setTimeout(() => setLoading(false), 250))
        }
    }, [refresh])

    const getImage = (image) => {
        try {
          const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
          return img;
        } catch {
          return null;
        }
    };

    const removeItemFromCart = (itemId) => {
        const newShoppingCart = shoppingCart.filter(item => item.itemId !== itemId)
        setShoppingCart(newShoppingCart)
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
            setShops('')
        }
    }
    

    const showItemData = (itemData, shopId) => {
        const outputData = itemData.map((item, i) => {
            return (
                <Col className="float-left mt-2" data-id={`${item.itemId}`} xs={6} lg={4} key={`${item.itemId}`} style={{textAlign: "center"}}>
                    <Image src={getImage(item.imageLink) ? getImage(item.imageLink) : ''} rounded style={{height:75}} />
                    <h6>{item.itemName}</h6>
                    Počet: <strong>{item.count}</strong> <br/>
                    Cena: <strong>{item.price}</strong> €
                    <Button style={{position: 'absolute', right: "20%", top: 0}} onClick={() => removeItemFromCart(item.itemId)} variant="danger" size="sm">X</Button>
                </Col>
            )
        })
        return outputData
    }

    const getTotalPrice = (itemData) => {
        let total = 0
        for (let item of itemData) {
            total += Number((item.price).replace(/,/g,"."))*item.count
        }
        return total
    }

    const getTotalItemPrice = (count, price) => {
        return (Number((price).replace(/,/g,"."))*count).toFixed(2).replace(/\./, ',')
    }

    const showCartItems = () => {
        const output = shops.sort((a, b) => (a.shopName > b.shopName) - (a.shopName < b.shopName)).map((shop, i) => {
            const {shopName, itemData} = shop
            return itemData.map(item => {
                const {itemId, itemName, price, imageLink, count} = item
                return (
                    <Row style={{fontSize: '110%'}} className="m-2" key={itemId}>
                        <Col xs={2}><img src={getImage(imageLink)} style={{height: '60px', width: '40px'}} /></Col>
                        <Col xs={4}><strong>{itemName}</strong><br />{shopName}</Col>
                        <Col xs={2}>{price} €</Col>
                        <Col xs={2}>{count}x</Col>
                        <Col xs={2}>Spolu: <strong>{getTotalItemPrice(count, price)} €</strong></Col>
                    </Row>
                )})
        })
        if (!loading) {
            return output
        }
    }

    const createNewOrder = () => {
        setOrderProcessing(true)
        let result = 0
        let deliveryPrice = 0
        let discountPrice = 0
        shops.map(shop => (shop.itemData).map(item => result += (Number((item.price).replace(/,/g,"."))*item.count)))
        let total = result
        const status = 'vytvorena'
        switch (deliveryCheck) {
            case OSOBNY: break;
            case ROZVOZ: 
                result += localDeliveryPrice; 
                deliveryPrice += localDeliveryPrice;
                break;
            case ZASIELKOVNA: 
                result += ZASIELKOVNA_PRICE; 
                deliveryPrice += ZASIELKOVNA_PRICE;
                break;
            case KURIER: 
                result += KURIER_PRICE; 
                deliveryPrice += KURIER_PRICE;
                break;
            default: break;
        }
        if (isValidDiscount && isValidDiscount > 0) {
            discountPrice = result*(1-isValidDiscount)
            result = result*isValidDiscount
            total = total*isValidDiscount
        }
        setPassOrderInfo({ orderId, userInformation, userId, shops, result, status, deliveryPrice, deliveryType: deliveryCheck, paymentType: paymentCheck })
        let orderError = false;
        const {id, carrierPickupPoint, url, place, nameStreet} = selectedPickupPoint
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/orders/add`, { token, discountPrice, orderId, userInformation, userId, shops, total, result, status, 
            deliveryPrice, deliveryType: deliveryCheck, paymentType: paymentCheck, packetInformation: {addressId: id, carrierPickupPoint, url, place, nameStreet} })
            .then(res => {
                console.log('order created!')
                setNewUser(true)
                if (newComerStamp === envComerStamp) {
                    axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/delete-newcomer-discount/${userId}`, {token})
                        .then(res => 'Discount removed.')
                        .catch(err => err && console.log(err))
                }
                if (checkedNewsletter) {
                    axios.post(`${process.env.REACT_APP_BACKEND_URL}/mails/add`, {name: userInformation.fullName, email: userInformation.email, token})
                        .then(res => console.log(res))
                        .catch(err => err && console.log(err))
                }   
            })
            .catch(err => orderError = true)
            .then(() => {
                setOrderProcessing(false)
                if (!orderError) {
                    sessionStorage.clear()
                    if ([INTERNET_BANKING, KARTA].includes(paymentCheck)) {
                        setPaymentPopup(true)
                    } else if (paymentCheck === PREVOD) {
                        history.push(`/success-payment?Reference=${orderId}&ResultCode=69`)
                    } else if (paymentCheck === DOBIERKA) {
                        history.push(`/success-payment?Reference=${orderId}&ResultCode=666`)
                    }
                } else {
                    setShowErrorMessage(true)
                }
            })
    }

    const handleRegistration = () => {
        setTimeout(() => executeScroll(),750)
        setLogin(false)
        setShipmentOnly(false)
        setRegistration(true)
    }

    const handleShipmentOnly = () => {
        setTimeout(() => executeScroll(),750)
        setLogin(false)
        setRegistration(false)
        setShipmentOnly(true)
    }

    const handleLogin = () => {
        setTimeout(() => executeScroll(),750)
        setRegistration(false)
        setShipmentOnly(false)
        setLogin(true)
    }

    useEffect(() => {
        if (regSuccess) setRegSuccess(false)
    }, [login, registration, shipmentOnly])

    useEffect(() => {
        if (typeof discount === 'string' && discount.toUpperCase() === process.env.REACT_APP_DISCOUNT_TOKEN) {
            setIsValidDiscount(0.90)
        } else if (newComerStamp === envComerStamp) {
            setIsValidDiscount(0.90)
        } else if (discount.toUpperCase() === process.env.REACT_APP_CUSTOMER_DISCOUNT) {
            setIsValidDiscount(0.95)
        } else {
            setIsValidDiscount('')
        }
    }, [discount])

    const showTotalCartPrice = () => {
        let result = 0
        let isDiscount = 0
        shops.map(shop => (shop.itemData).map(item => result += (Number((item.price).replace(/,/g,"."))*item.count)))
        if (result >= 150 && !isDeliveryFree) {
            setIsDeliveryFree(true)
        } else if (result < 150 && isDeliveryFree) {
            setIsDeliveryFree(false)
        }
        const resWithoutDelivery = result
        switch (deliveryCheck) {
            case OSOBNY: break;
            case ROZVOZ: result += localDeliveryPrice; break;
            case ZASIELKOVNA: result += ZASIELKOVNA_PRICE; break;
            case KURIER: result += KURIER_PRICE; break;
            default: break;
        }
        if (isValidDiscount && isValidDiscount > 0) (
            isDiscount = result*(1-isValidDiscount)
        )
        return (
            <>
            {newComerStamp === envComerStamp ?
            <Col className="text-center" xs={4}>
                <h6>Je použitá poregistračná zľava 10% z celkovej ceny objednávky.</h6>
                <br />
                <input 
                    className={`text-center form-control`}
                    type="text"
                    placeholder="Zľavy nemožno kombinovať"
                    disabled
                />
                <br />
            </Col> :  
            <Col xs={4}>
                <input 
                    className={`text-center form-control ${(discount && !isValidDiscount ) ? 'invalid-input' : ''}`}
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount((e.target.value).toUpperCase())}
                    placeholder="Zľavový kupón"
                />
            </Col>
            }
            <Col xs={12}>
                {isDiscount > 0 ?
                <>
                    <h3>
                        Finálna suma: {Number(result-isDiscount).toFixed(2).toString().replace(/\./g,',')} € 
                    </h3>
                    <em>
                        (po zľave v hodnote <strong>{Number(isDiscount).toFixed(2).toString().replace(/\./g,',')}</strong> €)
                    </em>
                </>
                :
                <h3>
                    Finálna suma: {Number(result).toFixed(2).toString().replace(/\./g,',')} €
                </h3>
                }
                {resWithoutDelivery < 150 ? <p style={{marginTop: '5px', fontSize: '125%'}}>Nakúpte ešte za <strong>{(150 - resWithoutDelivery).toFixed(2)} €</strong> a dopravu máte zadarmo.</p> : 
                <p style={{fontSize: '125%'}}>Dopravu máte <strong>zadarmo</strong>.</p>}
            </Col>
            </>
        )
    }

    return (
        <div style={{minHeight: '100vh', backgroundColor: 'whitesmoke'}}>
            {loading &&
                <Spinner
                    style={{ marginLeft: "49%", marginTop: "250px"}}
                    animation="border"
                />}
            {showErrorMessage &&
            <Alert className="text-center fixed-bottom" variant="danger" onClose={() => setShowErrorMessage(false)} dismissible>
                <Alert.Heading>Nepodarilo sa odoslat objednávku.</Alert.Heading>
                <p>
                    Skontrolujte, či máte internetové pripojenie, alebo správne vyplnené údaje (políčka by indikovali chybu červenou farbou). 
                    Ak je všetko v poriadku, problém bude zrejme na našej strane (výpadok databázy) - ospravedlňujeme sa.<br />
                    Objednávku je možné dokončiť aj telefonicky, alebo mailom pod sekciou <Link to="/kontakt">Kontakt</Link>.
                </p>
            </Alert>}
            <SlideDown className={"my-dropdown-slidedown"}>
                <Container style={{paddingTop: "50px", paddingBottom: "50px"}}>
                    { passOrderInfo && paymentPopup &&
                        <PayGate orderInfo={passOrderInfo} setPaymentPopup={setPaymentPopup} paymentPopup={paymentPopup} paymentCheck={paymentCheck} options={paymentOptions} />
                    }
                    {!loading && shops &&
                    <Row className="text-center pt-4">
                        <Col>
                            <h2>Vaše vína</h2>
                        </Col>
                    </Row>}
                    {(!loading && shops) && 
                    <div className="py-4" style={{borderBottom: '2px solid #c1c1c1'}}>
                        {showCartItems()}
                        <Row className="text-center pt-4 justify-content-center">
                            <br />
                            <br />
                            {shops && showTotalCartPrice()}
                        </Row>
                    </div>}
                    {!loading && shops &&
                    <>
                    <Row ref={lastRef}  className="text-center pt-4">
                        <Col>
                            <h2>Doručovacie údaje {registration && 's registráciou'}</h2>
                        </Col>
                    </Row>
                    <Row className="text-center">
                        <Col>
                            {(!userInformation && shops && !userId ) &&
                                <p>
                                    {login ? 
                                    <Button className="mt-2" onClick={() => handleShipmentOnly()} variant="dark">Nemám účet</Button>
                                    :
                                    <Button className="mt-2" onClick={() => handleLogin()} variant="dark">Mám účet a chcem sa prihlásit</Button> 
                                    }
                                </p>
                            }
                            {userInformation && 
                                <Button className="mt-2" onClick={() => setUncheckGdpr(true)} variant="dark">Zmeniť údaje</Button>
                            }
                        </Col>
                    </Row></>}
                    {!loading && shops &&
                    <Row className="text-center">
                        {login && <Login shoppingCart={true} />}
                        {registration && <SignUp setRegSuccess={setRegSuccess} regSuccess={regSuccess} uncheckGdpr={uncheckGdpr} setUncheckGdpr={setUncheckGdpr} newUser={newUser} setNewUser={setNewUser} userInformation={userInformation} shoppingCart={true} handleLogin={handleLogin} setUserInformation={setUserInformation} />}
                        {registration && regSuccess && <Col><h3 style={{color: 'green'}}>Registracia prebehla uspesne.</h3></Col> }
                        {shipmentOnly && <PlaceOrder uncheckGdpr={uncheckGdpr} setUncheckGdpr={setUncheckGdpr} checkedNewsletter={checkedNewsletter} setCheckedNewsletter={setCheckedNewsletter} setUserInformation={setUserInformation} userInformation={userInformation} />}
                    </Row>
                    }
                    {!loading && 
                    <Row style={{borderBottom: !loading && shops && '2px solid #c1c1c1'}} className="text-center pb-2">
                        <Col>
                            {(!userInformation && shops && !login  && !userId  ) &&
                                <p>
                                    {shipmentOnly ? 
                                    <>
                                        <em>Registráciou od nás získate 10% zľavu z celkovej sumy vášho prvého nákupu!</em>
                                        <br />
                                        <Button className="mt-2" onClick={() => handleRegistration()} variant="dark">Chcem sa registrovať!</Button>
                                    </> :
                                    <Button className="mt-2" onClick={() => handleShipmentOnly()} variant="dark">Bez registrácie</Button>}
                                </p>
                            }
                        </Col>
                    </Row>}
                    <SlideDown className={"my-dropdown-slidedown"}>
                        {shops && userInformation && 
                            <DeliveryOptions isDeliveryFree={isDeliveryFree} localDeliveryPrice={localDeliveryPrice} options={deliveryOptions} deliveryCheck={deliveryCheck} setSelectedPickupPoint={setSelectedPickupPoint} setDeliveryCheck={setDeliveryCheck} />}
                    </SlideDown>
                    <SlideDown className={"my-dropdown-slidedown"}>
                        {shops && userInformation && ((deliveryCheck && deliveryCheck !== ZASIELKOVNA) || selectedPickupPoint) && 
                            <PaymentOptions options={paymentOptions} paymentCheck={paymentCheck} setPaymentCheck={setPaymentCheck} />}
                    </SlideDown>
                    {!loading && 
                    <Row className="text-center">
                        <Col>
                            {((deliveryCheck && deliveryCheck !== ZASIELKOVNA) || selectedPickupPoint) && paymentCheck && userInformation && shops.length > 0 ?
                                <>
                                    {orderProcessing ? 
                                    <Spinner animation="border" />
                                    : <Button onClick={() => createNewOrder()} variant="dark">Prejsť k platbe{registration ? ' a registrovať sa' : ''}</Button>
                                    }
                                </>
                            :
                            <>  
                                {shops.length === 0 && 
                                    <>
                                        <h4>Nákupný košík je momentálne prázdny.</h4>
                                        <br />
                                        <br />
                                    </>
                                }
                                <Button disabled variant="dark">Vyplňte údaje pre doručenie</Button>
                            </>
                        }
                        </Col>
                    </Row>}
                </Container>
            </SlideDown>
        </div>
    )
}