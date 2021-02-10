import React, {useEffect } from 'react'
import axios from 'axios'

import { useLocation } from "react-router-dom";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

export default ({userId}) => {
    let query = useQuery();
    const orderId = query.get('Reference')
    const paymentId = query.get('PaymentRequestId')
    
    return (
        <p className="text-center" style={{color:'red'}}>Platba za objednavku cislo {orderId} nepresla. <br/>Referencne cislo platby {paymentId}</p>
    )
}