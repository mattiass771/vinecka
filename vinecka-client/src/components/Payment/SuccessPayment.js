import React, {useEffect, useState } from 'react'
import axios from 'axios'

import { useLocation, useHistory } from "react-router-dom";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export default ({userId}) => {
    let query = useQuery();
    const orderId = query.get('Reference')
    const result = query.get('ResultCode')
    const paymentId = query.get('PaymentRequestId')

    useEffect(() => {
        if (orderId.length !== 0) {
            axios.post(`http://localhost:5000/orders/${orderId}/process-payment/`, {paymentResultCode: result, paymentId})
                .then(res => console.log(res.data))
                .catch(err => err && console.log(err))
                .then(() => {
                    if (userId) {
                        axios.get(`http://localhost:5000/users/${userId}/cart/clear-cart`)
                            .then(res => console.log(res.data))
                            .catch(error => error && console.log(error))
                    }
                    localStorage.removeItem('shoppingCart')
                })
            
        }
    }, [])
    
    return (
        <p className="text-center">Platba za objednavku cislo {orderId} bola prijata. <br/>Cislo platby {paymentId}</p>
    )
}