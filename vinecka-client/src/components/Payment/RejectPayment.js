import React, {useEffect } from 'react'
import axios from 'axios'

import { useLocation, Link } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import {FcHighPriority} from "react-icons/fc"

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export default ({userId}) => {
    let query = useQuery();
    const orderId = query.get('Reference')
    const result = query.get('ResultCode')
    const paymentId = query.get('PaymentRequestId')

    useEffect(() => {
        if (orderId && orderId.length !== 0) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/orders/${orderId}/process-payment/`, {paymentResultCode: result, paymentId})
                .then(res => console.log(res.data))
                .catch(err => err && console.log(err))
                .then(() => {
                    if (userId) {
                        axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/cart/clear-cart`)
                            .then(res => console.log(res.data))
                            .catch(error => error && console.log(error))
                    }
                    localStorage.removeItem('shoppingCart')
                })            
        }
    }, [])
    
    return (
        <div className="whitesmoke-bg-pnine">
            <Container className="text-center pt-4 pb-4">
                <Row>
                    <Col>
                        <FcHighPriority style={{fontSize: "750%"}} />
                    </Col>
                </Row>
                <Row>
                    <Col style={{fontSize: "150%"}}>
                        Platba za objednávku číslo {orderId} bola odmietnutá.
                        <br />Platbu môžete zopakovať v sekcii <Link className="link-no-deco" to="/objednavky"><strong>Objednávky</strong></Link>.
                        <br />Číslo platby {paymentId || 'nenájdené'}.
                    </Col>
                </Row>
            </Container>   
        </div> 
    )
}