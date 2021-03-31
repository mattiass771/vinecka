import React, { useEffect, useState } from 'react'
import axios from 'axios'
import buildXmlBody from './buildXml'

import { useLocation, Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FcPaid } from "react-icons/fc";

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
    useEffect(() => {
        if (orderId && orderId.length !== 0) {
            axios.post(`https://mas-vino.herokuapp.com/orders/${orderId}/process-payment/`, {paymentResultCode: result, paymentId})
                .then(res => {
                    axios.get(`https://mas-vino.herokuapp.com/orders/get-by-custom-id/${orderId}`)
                        .then(res => setOrderInfo(res.data))
                        .catch(err => err && console.log(err))
                })
                .catch(err => err && console.log(err))
                .then(() => {
                    if (userId) {
                        axios.get(`https://mas-vino.herokuapp.com/users/${userId}/cart/clear-cart`)
                            .then(res => console.log(res.data))
                            .catch(error => error && console.log(error))
                    }
                    localStorage.removeItem('shoppingCart')
                    setUpdateCart(!updateCart)
                })            
        }
    }, [])

    useEffect(() => {
        if (orderInfo) {
            const {deliveryType, userInformation, result, packageAddresId, packageCarrierPickupPoint, total, paymentType, itemData } = orderInfo
            const zasielkaXml = buildXmlBody({orderId, userInformation, kurierom: KURIER, deliveryCheck: deliveryType, result, addressId: packageAddresId, carrierPickupPoint: packageCarrierPickupPoint, total, paymentCheck: paymentType, dobierka: DOBIERKA })
            if ([ZASIELKOVNA, KURIER].includes(deliveryType)) {
                axios.post(`https://www.zasilkovna.cz/api/rest`, zasielkaXml)
                    .then(res => console.log(res.data))
                    .catch(err => console.log(err))
            }
            // [WIP] : email order info - pass more zasielkovna info and create template
            //
            // const items = itemData.map(item => {
            //     const {itemName, price} = item
            //     return {itemName, price}
            // })
            // const emailData = {
            //     result, paymentType, deliveryType, userInformation, total, items
            // }
    
            // emailjs.sendForm('service_vjc9vdo', 'template_o2r5vl8', emailData, 'user_Pp2MD3ZQeVhPpppItiah8')
            // .then((result) => {
            //     console.log('success mailed', result)
            // }, (error) => {
            //     console.log('error mail', error)
            // });
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