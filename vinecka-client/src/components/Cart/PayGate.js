import React, {useEffect, useState } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import crypto from 'crypto'
import locutus from 'locutus/php/misc/pack'

export default ({paymentPopup, setPaymentPopup, orderInfo}) => {
    const {total, orderId } = orderInfo

    const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

    const GetSignature = (key, message) => {
        const encryptedKey = locutus('A*', key)
        const encryptedMessage = locutus('A*', message)
        const uint8arr = crypto.createHmac('sha256', encryptedKey).update(encryptedMessage).digest()
        const converted = toHexString(Buffer.from(uint8arr.buffer))
        return converted.toUpperCase()
    }

    const constructOrder = () => {
        const baseUrl = "https://playground.trustpay.eu/mapi5/wire/paypopup";
        const accountId = 2107205663;
        const amount = total;
        const currency = "EUR";
        const reference = orderId;
        const paymentType = 0;
    
        const secretKey = "5FIwY8FAc15vKHD96B9XQLhPIZdK8lNr";
        const sigData = `${accountId}/${amount.toFixed(2)}/${currency}/${reference}/${paymentType}`;
        const signature = GetSignature(secretKey, sigData); //eslint-disable-line
    
        const url = `${baseUrl}?AccountId=${accountId}&Amount=${amount}&Currency=${currency}&Reference=${reference}&PaymentType=${paymentType}&Signature=${signature}`
        return url;
    }

    return (
        <Modal style={{backgroundColor: 'rgba(255,255,255,0) !important'}} show={paymentPopup} onHide={() => setPaymentPopup(true)}>
            <iframe style={{padding: "-15px", width:"100%", height: "550px"}} id="TrustPayFrame" src={constructOrder()}></iframe>
            <div style={{
                position: 'absolute', 
                right: 15, 
                top: 15, 
                height: 50, 
                width: 50, 
                cursor: 'pointer'
            }} onClick={() => setPaymentPopup(false)}></div>
        </Modal>
    )
}