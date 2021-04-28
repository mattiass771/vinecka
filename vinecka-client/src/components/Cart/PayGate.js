import React, { useState, useEffect } from 'react'

import Modal from 'react-bootstrap/Modal'

import crypto from 'crypto'
import locutus from 'locutus/php/misc/pack'

const accId = process.env.REACT_APP_TRUSTPAY_PID
const secret = process.env.REACT_APP_TRUSTPAY_SECRET

export default ({paymentPopup, setPaymentPopup, orderInfo, paymentCheck, options}) => {
    const {KARTA, INTERNET_BANKING} = options
    const {result, orderId, userInformation } = orderInfo
    const {address, fullName, email} = userInformation
    const splitAddress = address.split(',')
    const [isCardPayment, setIsCardPayment] = useState('')

    useEffect(() => {
        setIsCardPayment(paymentCheck)
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
        const accountId = accId;
        const amount = result.toFixed(2);
        const currency = "EUR";
        const reference = orderId;
        const paymentType = 0;
    
        const secretKey = secret;
        const sigData = `${accountId}/${amount}/${currency}/${reference}/${paymentType}`;
        const signature = GetSignature(secretKey, sigData); //eslint-disable-line
    
        const url = `${baseUrl}?AccountId=${accountId}&Amount=${amount}&Currency=${currency}&Reference=${reference}&PaymentType=${paymentType}&Signature=${signature}`
        return url;
    }

    const constructCardOrder = () => {
        const baseUrl = "https://amapi.trustpay.eu/mapi5/Card/PayPopup";
        const accountId = accId;
        const amount = result.toFixed(2);
        const currency = "EUR";
        const reference = orderId;
        const paymentType = 0;
        const billingStreet = splitAddress[0]
        const billingPostCode = splitAddress[1]
        const billingCity = splitAddress[2]
        const billingCountry = "SK"
        const cardHolder = fullName
        const payerEmail = email
    
        const secretKey = secret;
        const sigData = `${accountId}/${amount}/${currency}/${reference}/${paymentType}/${billingCity}/${billingCountry}/${billingPostCode}/${billingStreet}/${cardHolder}/${payerEmail}`;
        const signature = GetSignature(secretKey, sigData); //eslint-disable-line
    
        const url = `${baseUrl}?AccountId=${accountId}&Amount=${amount}&Currency=${currency}&Reference=${reference}&PaymentType=${paymentType}&Signature=${signature}&BillingCity=${billingCity.replace(/ /g, '%20')}&BillingCountry=${billingCountry}&BillingPostcode=${billingPostCode.replace(/ /g, '%20')}&BillingStreet=${billingStreet.replace(/ /g, '%20')}&CardHolder=${cardHolder.replace(/ /g, '%20')}&Email=${payerEmail}`
        return url;
    }
    return (
        <Modal show={paymentPopup} onHide={() => setPaymentPopup(true)}>
            {isCardPayment === KARTA && 
            <iframe style={{padding: "-15px", width:"100%", height: "650px"}} id="TrustPayFrame" src={constructCardOrder()}></iframe>}
            {isCardPayment === INTERNET_BANKING &&  
            <iframe style={{padding: "-15px", width:"100%", height: "685px"}} id="TrustPayFrame" src={constructOrder()}></iframe>}
            <div style={{
                position: 'absolute', 
                right: 0, 
                top: 20, 
                height: 50, 
                width: 65, 
                cursor: 'pointer'
            }} onClick={() => setPaymentPopup(false)}></div> 
        </Modal>
    )
}