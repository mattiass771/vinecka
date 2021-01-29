import React, { useEffect, useState } from "react"
import axios from 'axios'
import { Link } from "react-router-dom";

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

export default ({userId}) => {
    const [shops, setShops] = useState('')
 
    const sortItems = (cartItems) => {
        console.log(cartItems)
        let sortShop = []
        for (let cartItem of cartItems) {
            axios.get(`http://localhost:5000/shop/${cartItem.shopId}`)
                .then((res) => {
                    const { shopName, owner } = res.data
                    const itemsArr = res.data.shopItems
                    const { size, color } = cartItem
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
                            sortShop[index].itemData = [...prevItems, {itemName, price, imageLink, size, color}]
                        } else {
                            const newShopId = cartItem.shopId
                            sortShop = [...sortShop, {shopId: newShopId, shopName, owner, itemData: [{itemName, price, imageLink, size, color}]}]
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
                .then((res) => res.data ? sortItems(res.data.shoppingCart) : [])
                .catch(err => err && console.log(err))
        }
    }, [])

    const showItemData = (itemData) => {
        let shopItemSet = new Set()
        let sameData = []
        for (let item of itemData) {
            const checkIfShopHas = Object.values(item).toString()
            if (shopItemSet.has(checkIfShopHas)) {
                for (let val of sameData) {
                    const findMatch = Object.values(val).toString()
                    if (findMatch.substring(0,findMatch.lastIndexOf(',')) === checkIfShopHas) {
                        val.count++
                        break
                    }
                }
            } else {
                shopItemSet.add(checkIfShopHas)
                sameData = [...sameData, { ...item, count: 1 }]
            }
        }
        const outputData = sameData.map((item, i) => {
            return (
                <Col md={3} xs={6} lg={2} key={`${item.itemName}-${item.color}-${item.size}-${item.price}`} style={{textAlign: "center"}}>
                    <Image src={item.imageLink} rounded style={{height:75}} />
                    <h6>{item.itemName}</h6>
                    <p>{item.color}, {item.size}<br />
                    Count: {item.count}<br />
                    {item.price} €</p>
                </Col>
            )
        })
        return outputData
    }

    const getTotalPrice = (itemData) => {
        let total = 0
        for (let item of itemData) {
            total += Number(item.price)
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
                                <p>Owner: {shop.owner}</p>
                            </div>
                            <div className="text-right">
                                <h5>Total: {getTotalPrice(shop.itemData)} €</h5>
                                <Link to="/shop/payment">
                                    <Button variant="dark" size="sm">Proceed to Checkout</Button>
                                </Link>
                            </div>
                        </div>
                    </Col>
                    {showItemData(shop.itemData)}
                </Row>
            )
        })
    }

    return <Container style={{paddingTop: "50px"}}>{shops && showCartItems()}</Container>
}