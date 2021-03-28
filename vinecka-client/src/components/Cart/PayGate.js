import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import crypto from 'crypto'
import locutus from 'locutus/php/misc/pack'

import {FaRegCreditCard} from 'react-icons/fa'
import {RiBankFill, RiBankLine} from 'react-icons/ri'

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";
import Spinner from "react-bootstrap/Spinner";

export default ({paymentPopup, setPaymentPopup, orderInfo}) => {
    const {total, orderId, userInformation } = orderInfo
    const {address, fullName, email} = userInformation
    const splitAddress = address.split(',')
    const [isCardPayment, setIsCardPayment] = useState('')
    const [isHovered, setIsHovered] = useState('')
    const [creds, setCreds] = useState('')

    useEffect(() => {
        axios.get(`https://mas-vino.herokuapp.com/orders/get-payment-credentials`)
            .then(res => {
                setCreds(res.data)
                setIsCardPayment('card')
            })
            .catch(err => console.log('Error retrieving trustpay creds, ', err))
    }, [])

    const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

    const GetSignature = (key, message) => {
        const encryptedKey = locutus('A*', key)
        const encryptedMessage = locutus('A*', message)
        const uint8arr = crypto.createHmac('sha256', encryptedKey).update(encryptedMessage).digest()
        const converted = toHexString(Buffer.from(uint8arr.buffer))
        return converted.toUpperCase()
    }

    const constructOrder = () => {
        const baseUrl = "https://amapi.trustpay.eu/mapi5/wire/paypopup";
        const accountId = creds.accountId;
        const amount = total.toFixed(2);
        const currency = "EUR";
        const reference = orderId;
        const paymentType = 0;
    
        const secretKey = creds.secret;
        const sigData = `${accountId}/${amount}/${currency}/${reference}/${paymentType}`;
        const signature = GetSignature(secretKey, sigData); //eslint-disable-line
    
        const url = `${baseUrl}?AccountId=${accountId}&Amount=${amount}&Currency=${currency}&Reference=${reference}&PaymentType=${paymentType}&Signature=${signature}`
        return url;
    }

    const constructCardOrder = () => {
        const baseUrl = "https://amapi.trustpay.eu/mapi5/Card/PayPopup";
        const accountId = creds.accountId;
        const amount = total.toFixed(2);
        const currency = "EUR";
        const reference = orderId;
        const paymentType = 0;
        const billingStreet = splitAddress[0]
        const billingPostCode = splitAddress[1]
        const billingCity = splitAddress[2]
        const billingCountry = "SK"
        const cardHolder = fullName
        const payerEmail = email
    
        const secretKey = creds.secret;
        const sigData = `${accountId}/${amount}/${currency}/${reference}/${paymentType}/${billingCity}/${billingCountry}/${billingPostCode}/${billingStreet}/${cardHolder}/${payerEmail}`;
        const signature = GetSignature(secretKey, sigData); //eslint-disable-line
    
        const url = `${baseUrl}?AccountId=${accountId}&Amount=${amount}&Currency=${currency}&Reference=${reference}&PaymentType=${paymentType}&Signature=${signature}&BillingCity=${billingCity.replace(/ /g, '%20')}&BillingCountry=${billingCountry}&BillingPostcode=${billingPostCode.replace(/ /g, '%20')}&BillingStreet=${billingStreet.replace(/ /g, '%20')}&CardHolder=${cardHolder.replace(/ /g, '%20')}&Email=${payerEmail}`
        return url;
    }

    return (
        <Modal style={{backgroundColor: 'rgba(255,255,255,0) !important'}} show={paymentPopup} onHide={() => setPaymentPopup(true)}>
            <Container>
                <Row>
                    <Col style={{cursor: 'pointer', borderRadius: '5px', backgroundColor: (isHovered === 'card' || isCardPayment === 'card') ? '#2b371b' : '', color: (isHovered === 'card' || isCardPayment === 'card') ? 'whitesmoke' : '#333333'}} className="text-center" onMouseEnter={() => setIsHovered('card')} onMouseLeave={() => setIsHovered('')} onClick={() => setIsCardPayment('card')} >
                        {isHovered === 'card' ? 
                            <>Platba Kartou <br /><FaRegCreditCard style={{fontSize: '250%'}}/></> : 
                            <>Platba Kartou <br /><FaRegCreditCard style={{fontSize: '250%'}} /></>}
                    </Col>
                    <Col style={{cursor: 'pointer', borderRadius: '5px', backgroundColor: (isHovered === 'wire' || isCardPayment === 'wire') ? '#2b371b' : '', color: (isHovered === 'wire' || isCardPayment === 'wire') ? 'whitesmoke' : '#333333'}} className="text-center" onMouseEnter={() => setIsHovered('wire')} onMouseLeave={() => setIsHovered('')} onClick={() => setIsCardPayment('wire')} >
                        {isHovered === 'wire' ? 
                            <>Platba Prevodom <br /><RiBankLine style={{fontSize: '250%'}} /></>  : 
                            <>Platba Prevodom <br /><RiBankFill style={{fontSize: '250%'}} /></> }
                    </Col>
                </Row>
            </Container>
            <SlideDown className={"my-dropdown-slidedown"}>
                <Container>
                    {isCardPayment === 'card' && 
                    <iframe style={{padding: "-15px", width:"100%", height: "650px"}} id="TrustPayFrame" src={constructCardOrder()}></iframe>}
                    {isCardPayment === 'wire' &&  
                    <iframe style={{padding: "-15px", width:"100%", height: "685px"}} id="TrustPayFrame" src={constructOrder()}></iframe>}
                    <div style={{
                        position: 'absolute', 
                        right: 20, 
                        top: 100, 
                        height: 50, 
                        width: 75, 
                        cursor: 'pointer'
                    }} onClick={() => setPaymentPopup(false)}></div> 
                    <span style={{
                        position: 'absolute', 
                        top: 248,
                        left: 20,
                        color: '#ededee'
                    }}>Platobná brána sa načítava, prosím počkajte...</span>
                </Container>
            </SlideDown>
        </Modal>
    )
}