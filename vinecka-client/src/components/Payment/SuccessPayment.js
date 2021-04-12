import React, { useEffect, useState } from 'react'
import axios from 'axios'
import buildXmlBody from './buildXml'
import emailjs from 'emailjs-com';

import { useLocation, Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FcPaid } from "react-icons/fc";

const token = process.env.REACT_APP_API_SECRET

const KURIER = 'kurier'
const ZASIELKOVNA = 'zasielkovna'
const DOBIERKA = 'dobierka'

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export default ({userId, updateCart, setUpdateCart}) => {
    let query = useQuery();
    const orderId = query.get('Reference')
    const result = query.get('ResultCode')
    const paymentId = query.get('PaymentRequestId')
    const [orderInfo, setOrderInfo] = useState('')
    const [mailSent, setMailSent] = useState('')
    useEffect(() => {
        if (orderId && orderId.length !== 0) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/orders/${orderId}/process-payment/`, {token, paymentResultCode: result, paymentId})
                .then(res => {
                    setMailSent('can_send')
                    axios.post(`${process.env.REACT_APP_BACKEND_URL}/orders/get-by-custom-id/${orderId}`, {token})
                        .then(res => {
                            setOrderInfo(res.data)
                        })
                        .catch(err => err && console.log(err))
                })
                .catch(err => err && console.log(err))
                .then(() => {
                    if (userId) {
                        axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/cart/clear-cart`, {token})
                            .then(res => setUpdateCart(!updateCart))
                            .catch(error => error && console.log(error))
                    }
                    localStorage.removeItem('shoppingCart')
                    setUpdateCart(!updateCart)
                })            
        }
    }, [])

    useEffect(() => {
        if (orderInfo && mailSent === 'can_send') {
            const {deliveryType, userInformation, result, packetInformation, total, paymentType, shops, deliveryPrice, discountPrice } = orderInfo
            let addressId, carrierPickupPoint, url, place, nameStreet;
            if (packetInformation) {
                addressId = packetInformation.addressId
                carrierPickupPoint = packetInformation.carrierPickupPoint
                url = packetInformation.url
                place = packetInformation.place
                nameStreet = packetInformation.nameStreet
            }
            const { fullName, email, address, phone } = userInformation

            const zasielkaXml = buildXmlBody({orderId, userInformation, kurierom: KURIER, deliveryCheck: deliveryType, result, addressId, carrierPickupPoint, total, paymentCheck: paymentType, dobierka: DOBIERKA })
            
            if ([ZASIELKOVNA, KURIER].includes(deliveryType)) {
                axios.post(`https://www.zasilkovna.cz/api/rest`, zasielkaXml)
                    .then(res => console.log('ZASIELKOVNA PACKET VYTVORENY', res.data))
                    .catch(err => console.log(err))
            }            
            
            const itemData = shops.map(shop => shop.itemData)
            const items = itemData ? itemData.map(item => {
                return item.map(el => {
                    const {itemName, price, count} = el
                    return `${itemName} - ${price}€/ks (${count})`
                })
            }) : []
            const itemString = items.join(", ")
            const splitName = fullName.split(' ')
            const firstName = splitName[0]
            const deliveryStreet = nameStreet ? nameStreet : address
            const emailData = {
                discountPrice: discountPrice.toFixed(2), total: total.toFixed(2), result: result.toFixed(2), deliveryPrice: deliveryPrice.toFixed(2), paymentType, deliveryType, firstName, fullName, email, itemString, url, place, deliveryStreet, orderId, phone
            }
    
            emailjs.send('service_d4aksie', 'template_gqe4ejf', emailData, process.env.REACT_APP_EMAILJS_USERID)
            .then((result) => {
                setMailSent('')
                console.log('success mailed', result)
            }, (error) => {
                console.log('error mail', error)
            });
        }
    }, [orderInfo])
    
    return (
        <div className="whitesmoke-bg-pnine">
            <Container className="text-center pt-4 pb-4">
                <Row>
                    <Col>
                        <FcPaid style={{fontSize: "750%"}} />
                    </Col>
                </Row>
                {result.toString() === '666' ?
                <Row>
                    <Col style={{fontSize: "150%"}}>
                        Zävazná objednávka číslo {orderId} bola spracovaná. 
                        {userId && <><br />Podrobnejšie detaily nájdete v sekcii <Link className="link-no-deco" to="/objednavky"><strong>Objednávky</strong></Link>.</>}
                        <br/>Platba bude realizovaná pri prebratí zásielky.
                    </Col>
                </Row>
                : result.toString() === '69' ?
                <>
                    <Row>
                        <Col style={{fontSize: "150%"}}>
                            Zävazná objednávka číslo {orderId} bola spracovaná. 
                            {userId && <><br />Podrobnejšie detaily nájdete v sekcii <Link className="link-no-deco" to="/objednavky"><strong>Objednávky</strong></Link>.</>}
                            <br/>Uhraďte ju prosím čo najskôr použitím údajov nižšie.
                        </Col> 
                    </Row>
                    <Row className="text-left my-4" style={{fontSize: "175%"}}>
                        <Col xs={{offset: 2, span: 4}}>IBAN:</Col>
                        <Col xs={{span: 6}}><strong>SK21 1111 0000 0016 0902 7005</strong></Col>
                        <Col xs={{offset: 2, span: 4}}>BIC/SWIFT:</Col>
                        <Col xs={{span: 6}}><strong>UNCRSKBX</strong></Col>
                        <Col xs={{offset: 2, span: 4}}>VARIABILNY SYMBOL:</Col>
                        <Col xs={{span: 6}}><strong>{orderId}</strong></Col>
                        <Col xs={{offset: 2, span: 4}}>SUMA:</Col>
                        <Col xs={{span: 6}}><strong>{orderInfo && orderInfo.result} €</strong></Col>
                    </Row>
                </>
                :
                <Row>
                    <Col style={{fontSize: "150%"}}>
                        Platba za objednávku číslo {orderId} bola spracovaná. 
                        {userId && <><br />Podrobnejšie detaily nájdete v sekcii <Link className="link-no-deco" to="/objednavky"><strong>Objednávky</strong></Link>.</>}
                        <br/>Číslo platby {paymentId || 'nenájdené'}.
                    </Col> 
                </Row>
                }
            </Container>
        </div>
    )
}