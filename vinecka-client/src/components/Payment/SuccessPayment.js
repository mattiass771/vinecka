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

export default ({userId}) => {
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
                })            
        }
    }, [])

    useEffect(() => {
        console.log(orderInfo)
        if (orderInfo) {
            const {deliveryType, userInformation, result, packageAddresId, packageCarrierPickupPoint, total, paymentType } = orderInfo
            const zasielkaXml = buildXmlBody({orderId, userInformation, kurierom: KURIER, deliveryCheck: deliveryType, result, addressId: packageAddresId, carrierPickupPoint: packageCarrierPickupPoint, total, paymentCheck: paymentType, dobierka: DOBIERKA })
            if ([ZASIELKOVNA, KURIER].includes(deliveryType)) {
                axios.post(`https://www.zasilkovna.cz/api/rest`, zasielkaXml)
                    .then(res => console.log(res.data))
                    .catch(err => console.log(err))
            }
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
                <Row>
                    {result.toString() !== '666' ?
                    <Col style={{fontSize: "150%"}}>
                        Platba za objednávku číslo {orderId} bola spracovaná. 
                        {userId && <><br />Podrobnejšie detaily nájdete v sekcii <Link className="link-no-deco" to="/objednavky"><strong>Objednávky</strong></Link>.</>}
                        <br/>Číslo platby {paymentId || 'nenájdené'}.
                    </Col> 
                    : result.toString() !== '69' ?
                    <Col style={{fontSize: "150%"}}>
                        Zävazná objednávka číslo {orderId} bola spracovaná. 
                        {userId && <><br />Podrobnejšie detaily nájdete v sekcii <Link className="link-no-deco" to="/objednavky"><strong>Objednávky</strong></Link>.</>}
                        <br/>Uhraďte ju prosím čo najskôr použitím údajov nižšie.
                    </Col> 
                    :
                    <Col style={{fontSize: "150%"}}>
                        Zävazná objednávka číslo {orderId} bola spracovaná. 
                        {userId && <><br />Podrobnejšie detaily nájdete v sekcii <Link className="link-no-deco" to="/objednavky"><strong>Objednávky</strong></Link>.</>}
                        <br/>Platba bude realizovaná pri prebratí zásielky.
                    </Col>
                    }
                </Row>
            </Container>
        </div>
    )
}