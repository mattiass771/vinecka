import React, { useEffect, useState, useRef } from "react"
import axios from 'axios'
import { nanoid } from 'nanoid'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Spinner from "react-bootstrap/Spinner";

import PlaceOrder from './PlaceOrder'
import SignUp from '../Login/SignUp'
import Login from '../Login/Login'
import PayGate from './PayGate'

export default ({userId, updateCart, setUpdateCart}) => {
    const lastRef = useRef(null)
    const [shops, setShops] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [userInformation, setUserInformation] = useState('')
    const [login, setLogin] = useState(false)
    const [registration, setRegistration] = useState(false)
    const [shipmentOnly, setShipmentOnly] = useState(false)
    const [loading, setLoading] = useState(false)
    const [orderId, setOrderId] = useState(nanoid())
    const [passOrderInfo, setPassOrderInfo] = useState({})
    const [paymentPopup, setPaymentPopup] = useState(false)  
    const [checkedNewsletter, setCheckedNewsletter] = useState(false)

    const executeScroll = () => lastRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })   
 
    const sortItems = (cartItems) => {
        let sortShop = []
        for (let cartItem of cartItems) {
            axios.get(`https://mas-vino.herokuapp.com/shop/${cartItem.shopId}`)
                .then((res) => {
                    if (res.data && res.data.shopName) {
                        const { shopName, owner } = res.data
                        const itemsArr = res.data.shopItems
                        const { count, itemId } = cartItem
                        const findItem = itemsArr.find(el => el._id === cartItem.itemId)
                        if (findItem === undefined) {
                            axios.post(`https://mas-vino.herokuapp.com/users/${userId}/cart/delete-cart-item/${cartItem.shopId}/${cartItem.itemId}`)
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
                .then(() => setShops([...sortShop]))
        }
    }

    useEffect(() => {
        setLoading(true)
        const localShoppingCart = localStorage.getItem('shoppingCart')
        if (userId) {
            const parsedShoppingCart = localShoppingCart ? JSON.parse(localShoppingCart) : []
            if (parsedShoppingCart.length !== 0) {
                const addItemsToShoppingCartFromLocal = async () => {
                    for (let cartItem of parsedShoppingCart) {
                        const {shopId, itemId, count} = cartItem
                        console.log('importing item ', itemId)
                        await axios
                            .post(`https://mas-vino.herokuapp.com/users/${userId}/cart/add-cart-item/${shopId}/${itemId}`, {
                                shopId, itemId, count
                            })
                            .then((res) => console.log(res))
                            .catch(err => err && console.log(err))
                    }
                    localStorage.removeItem('shoppingCart')
                    console.log('Importing done.')
                }
                addItemsToShoppingCartFromLocal()
            }
            axios
                .get(`https://mas-vino.herokuapp.com/users/${userId}`)
                .then((res) => {
                    if (res.data) {
                        const {shoppingCart, fullName, email, phone, address} = res.data
                        sortItems([...shoppingCart, ...parsedShoppingCart])
                        setUserInformation({ fullName, email, phone, address })
                    }
                })
                .catch(err => err && console.log(err))
        } else {
            const localShoppingCart = localStorage.getItem('shoppingCart')
            localShoppingCart && sortItems(JSON.parse(localShoppingCart))
        }
        setLoading(false)
    }, [refresh])

    const getImage = (image) => {
        try {
          const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
          return img;
        } catch {
          return null;
        }
    };

    const removeItemFromCart = (e, itemId, shopId) => {
        if (userId) {
            axios.post(`https://mas-vino.herokuapp.com/users/${userId}/cart/delete-cart-item/${shopId}/${itemId}`)
                .then((res) => console.log(res))
                .catch(err => err && console.log('could not delete item', err))
                .then(() => {
                    setRefresh(!refresh)
                    setUpdateCart(!updateCart)
                }) 
            if (shops.length === 1) setShops('')
        } else {
            const localShoppingCart = JSON.parse(localStorage.getItem('shoppingCart'))
            const newLocalShoppingCart = localShoppingCart.filter(item => item.itemId !== itemId)
            localStorage.removeItem('shoppingCart')
            console.log(newLocalShoppingCart, shops)
            if (newLocalShoppingCart.length !== 0) {
                localStorage.setItem('shoppingCart', JSON.stringify(newLocalShoppingCart))
            } else {
                setShops('')
            }
            setRefresh(!refresh)
            setUpdateCart(!updateCart)
        }
    }

    const showItemData = (itemData, shopId) => {
        const outputData = itemData.map((item, i) => {
            return (
                <Col data-id={`${item.itemId}`} md={3} xs={6} lg={2} key={`${item.itemId}`} style={{textAlign: "center"}}>
                    <Image src={getImage(item.imageLink) ? getImage(item.imageLink) : ''} rounded style={{height:75}} />
                    <h6>{item.itemName}</h6>
                    <p>
                    Počet: {item.count}<br />
                    {item.price} €</p>
                    <Button style={{position: 'absolute', right: "20%", top: 0}} onClick={(e) => removeItemFromCart(e, item.itemId, shopId)} variant="danger" size="sm">X</Button>
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

    //homes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    const showCartItems = () => {
        return shops.sort((a, b) => (a.shopName > b.shopName) - (a.shopName < b.shopName)).map(shop => {
            return (
                <Row key={shop.shopId} style={{marginBottom: "15px"}}>
                    <Col style={{marginBottom: "50px"}} xs={12}>
                        <hr />
                        <div style={{display: "flex", justifyContent:"space-between"}}>
                            <div>
                                <h4>{shop.shopName}</h4>
                            </div>
                            <div className="text-right">
                                <h5>Suma: {(getTotalPrice(shop.itemData)).toFixed(2).toString().replace(/\./g,',')} €</h5>
                            </div>
                        </div>
                    </Col>
                    {showItemData(shop.itemData, shop.shopId)}
                </Row>
            )
        })
    }

    const createNewOrder = () => {
        let result = 0
        shops.map(shop => (shop.itemData).map(item => result += (Number((item.price).replace(/,/g,"."))*item.count)))
        const total = result
        const status = 'vytvorena'
        setPassOrderInfo({ orderId, userInformation, userId, shops, total, status })
        setPaymentPopup(true)
        axios.post(`https://mas-vino.herokuapp.com/orders/add`, { orderId, userInformation, userId, shops, total, status })
            .then(res => {
                if (checkedNewsletter) {
                    axios.post(`https://mas-vino.herokuapp.com/mails/add`, {name: userInformation.fullName, email: userInformation.email})
                        .then(res => console.log(res))
                        .catch(err => err && console.log(err))
                }
            })
            .catch(err => err && console.log(err))
    }

    const handleRegistration = () => {
        setTimeout(() => executeScroll(),500)
        setLogin(false)
        setShipmentOnly(false)
        setRegistration(true)
    }

    const handleShipmentOnly = () => {
        setTimeout(() => executeScroll(),500)
        setLogin(false)
        setRegistration(false)
        setShipmentOnly(true)
    }

    const handleLogin = () => {
        setTimeout(() => executeScroll(),500)
        setRegistration(false)
        setShipmentOnly(false)
        setLogin(true)
    }


    const showTotalCartPrice = () => {
        let result = 0
        shops.map(shop => (shop.itemData).map(item => result += (Number((item.price).replace(/,/g,"."))*item.count)))
        return (
            <Col>
                <h3>Finalna suma: {result.toFixed(2).toString().replace(/\./g,',')} €</h3>
            </Col>
        )
    }

    return (
        <div className="whitesmoke-bg-pnine">
            <Container style={{paddingTop: "50px", paddingBottom: "50px"}}>
                { passOrderInfo && paymentPopup &&
                    <PayGate orderInfo={passOrderInfo} setPaymentPopup={setPaymentPopup} paymentPopup={paymentPopup} />
                }
                {loading ? 
                    <Spinner
                        style={{ marginLeft: "49%", marginTop: "20%" }}
                        animation="border"
                    /> : 
                (shops && showCartItems())}
                <Row className="text-center">
                    <Col>
                        {(!userInformation && shops ) &&
                            <p>
                                <Button className="mt-2" onClick={() => handleRegistration()} variant="dark">Dorucovacie udaje s registraciou</Button>
                                &nbsp;&nbsp;
                                <Button className="mt-2" onClick={() => handleLogin()} variant="dark">Mam ucet a chcem sa prihlasit</Button>
                                &nbsp;&nbsp;
                                <Button className="mt-2" onClick={() => handleShipmentOnly()} variant="dark">Dorucovacie udaje bez registracie</Button>
                            </p>
                        }
                    </Col>
                </Row>
                <Row ref={lastRef} className="text-center">
                    {login && <Login shoppingCart={true} />}
                    {registration && <SignUp shoppingCart={true} handleLogin={handleLogin} />}
                    {shipmentOnly && <PlaceOrder checkedNewsletter={checkedNewsletter} setCheckedNewsletter={setCheckedNewsletter} setUserInformation={setUserInformation} />}
                </Row>
                <Row className="text-center">
                    <br />
                    <br />
                    {shops && showTotalCartPrice()}
                </Row>
                <Row className="text-center">
                    <Col>
                        {userInformation && shops.length > 0 ?
                            <Button onClick={() => createNewOrder()} variant="dark">Prejst k platbe</Button>
                        :
                        <>  
                            {shops.length === 0 && 
                                <>
                                    <h4>Nakupny kosik je momentálne prazdny.</h4>
                                    <br />
                                    <br />
                                </>
                            }
                            <Button disabled variant="dark">Prejst k platbe</Button>
                        </>
                    }
                    </Col>
                </Row>
            </Container>
        </div>
    )
}