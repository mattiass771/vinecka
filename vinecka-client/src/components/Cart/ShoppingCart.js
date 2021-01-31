import React, { useEffect, useState } from "react"
import axios from 'axios'
import { Link } from "react-router-dom";
import { nanoid } from 'nanoid'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

import PlaceOrder from './PlaceOrder'
import SignUp from '../Login/SignUp'

export default ({userId}) => {
    const [shops, setShops] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [userInformation, setUserInformation] = useState('')
    const [registration, setRegistration] = useState(false)
    const [shipmentOnly, setShipmentOnly] = useState(false)
 
    const sortItems = (cartItems) => {
        let sortShop = []
        for (let cartItem of cartItems) {
            axios.get(`http://localhost:5000/shop/${cartItem.shopId}`)
                .then((res) => {
                    const { shopName, owner } = res.data
                    const itemsArr = res.data.shopItems
                    const { count, itemId } = cartItem
                    const findItem = itemsArr.find(el => el._id === cartItem.itemId)
                    if (findItem === undefined) {
                        axios.post(`http://localhost:5000/users/${userId}/cart/delete-cart-item/${cartItem.shopId}/${cartItem.itemId}`)
                            .then((res) => console.log(res))
                            .catch(err => err && console.log('could not delete item', err))
                    } else {
                        const { itemName, price, imageLink } = findItem
                        const index = sortShop.findIndex(el => el.shopId === cartItem.shopId)
                        if (index >= 0) {
                            const prevItems = sortShop[index].itemData
                            const isInCart = prevItems.findIndex(el => el.itemId === itemId)
                            if (isInCart !== -1) {
                                sortShop[index].itemData[isInCart].count += count
                            } else {
                                sortShop[index].itemData = [...prevItems, {itemId, itemName, price, imageLink, count}]
                            }
                        } else {
                            const newShopId = cartItem.shopId
                            sortShop = [...sortShop, {shopId: newShopId, shopName, owner, itemData: [{itemId, itemName, price, imageLink, count}]}]
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
        if (userId) {
            axios
                .get(`http://localhost:5000/users/${userId}`)
                .then((res) => {
                    if (res.data) {
                        const {shoppingCart, fullName, email, phone, address} = res.data
                        sortItems(shoppingCart)
                        setUserInformation({ fullName, email, phone, address })
                    }
                })
                .catch(err => err && console.log(err))
        }
    }, [refresh])

    const getImage = (image) => {
        try {
          const img = require(`../../../../src/uploads/${image}`);
          return img;
        } catch {
          return null;
        }
    };

    const removeItemFromCart = (e, itemId, shopId) => {
        axios.post(`http://localhost:5000/users/${userId}/cart/delete-cart-item/${shopId}/${itemId}`)
            .then((res) => console.log(res))
            .catch(err => err && console.log('could not delete item', err))
            .then(() => setRefresh(!refresh))
    }

    const showItemData = (itemData, shopId) => {
        const outputData = itemData.map((item, i) => {
            return (
                <Col data-id={`${item.itemId}`} md={3} xs={6} lg={2} key={`${item.itemId}`} style={{textAlign: "center"}}>
                    <Image src={getImage(item.imageLink) ? getImage(item.imageLink) : ''} rounded style={{height:75}} />
                    <h6>{item.itemName}</h6>
                    <p>
                    Count: {item.count}<br />
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

    const showCartItems = () => {
        return shops.map(shop => {
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
        console.log(shops, userId, result, nanoid(), userInformation)
        const orderId = nanoid()
        const total = result
        const status = 'started'
        axios.post(`http://localhost:5000/orders/add`, { orderId, userInformation, userId, shops, total, status })
            .then(res => console.log(res.data))
            .catch(err => err && console.log(err))
    }

    const handleRegistration = () => {
        setShipmentOnly(false)
        setRegistration(true)
    }

    const handleShipmentOnly = () => {
        setRegistration(false)
        setShipmentOnly(true)
    }


    const showTotalCartPrice = () => {
        let result = 0
        shops.map(shop => (shop.itemData).map(item => result += (Number((item.price).replace(/,/g,"."))*item.count)))
        return (
            <Col>
                <h3>Finalna suma: {result.toFixed(2).toString().replace(/\./g,',')} €</h3>
                {!userInformation ?
                <Link to="/shop/payment">
                    <Button onClick={() => createNewOrder()} variant="dark">Prejst k platbe</Button>
                </Link> :
                <p>
                    <Button onClick={() => handleRegistration()} variant="dark">Dorucovacie udaje s registraciou</Button>
                    &nbsp;&nbsp;
                    <Button onClick={() => handleShipmentOnly()} variant="dark">Dorucovacie udaje bez registracie</Button>
                </p>
                }
            </Col>
        )
    }

    return (
        <Container style={{paddingTop: "50px"}}>
            {shops && showCartItems()}
            <Row className="text-center">
                {shops && showTotalCartPrice()}
            </Row>
            <Row>
                {registration && <SignUp />}
                {shipmentOnly && <PlaceOrder />}
            </Row>
        </Container>
    )
}