import React, { useEffect, useState } from "react"
import axios from 'axios'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

export default ({userId}) => {
    const [shops, setShops] = useState('')
 
    const sortItems = (cartItems) => {
        let sortShop = []
        for (let cartItem of cartItems) {
            axios.get(`http://localhost:5000/shop/${cartItem.shopId}`)
                .then((res) => {
                    const { shopName, owner } = res.data
                    const itemsArr = res.data.shopItems
                    const findItem = itemsArr.find(el => el._id === cartItem.itemId)
                    const { itemName, price, imageLink } = findItem
                    const index = sortShop.findIndex(el => el.shopId === cartItem.shopId)
                    if (index >= 0) {
                        const prevItems = sortShop[index].itemData
                        sortShop[index].itemData = [...prevItems, {itemName, price, imageLink}]
                    } else {
                        const newShopId = cartItem.shopId
                        sortShop = [...sortShop, {shopId: newShopId, shopName, owner, itemData: [{itemName, price, imageLink}]}]
                    }
                })
                .catch(err => err && console.log(err))
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
        return itemData.map((item, i) => {
            return (
                <Col key={i}>
                    <Image src={item.imageLink} rounded style={{height:75}} />
                    <h6>{item.itemName}</h6>
                    <p>{item.price}</p>
                </Col>
            )
        })
    }

    const showCartItems = () => {
        return shops.map(shop => {
            console.log(shop)
            return (
                <Row key={shop.shopId}>
                    <Col xs={12}>
                        <h4>{shop.shopName}</h4>
                        <p>{shop.owner}</p>
                        <hr />
                    </Col>
                    {showItemData(shop.itemData)}
                </Row>
            )
        })
    }

    return <Container style={{paddingTop: "50px"}}>{shops && showCartItems()}</Container>
}