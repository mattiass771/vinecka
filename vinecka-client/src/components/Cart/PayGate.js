import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

const token = process.env.REACT_APP_API_SECRET

export default ({paymentPopup, setPaymentPopup, orderInfo, paymentCheck, options}) => {
    const {KARTA, INTERNET_BANKING} = options
    const [url, setUrl] = useState('')

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/pay-gate/${paymentCheck}`, {token, orderInfo})
            .then(res => {
                const response = res.data
                console.log('response from backend: ', response)
                setUrl(response)
            })
            .catch(err => console.log(err));
    }, [])

    return (
        <Modal show={paymentPopup} onHide={() => setPaymentPopup(true)}>
            {(url && url.length > 0) ? 
            <>
                {paymentCheck === KARTA && 
                <iframe style={{padding: "-15px", width:"100%", height: "650px"}} id="TrustPayFrame" src={url}></iframe>}
                {paymentCheck === INTERNET_BANKING &&  
                <iframe style={{padding: "-15px", width:"100%", height: "685px"}} id="TrustPayFrame" src={url}></iframe>}
                <div style={{
                    position: 'absolute', 
                    right: 0, 
                    top: 20, 
                    height: 50, 
                    width: 65, 
                    cursor: 'pointer'
                }} onClick={() => setPaymentPopup(false)}></div> 
            </> : 
            <div className="text-center" style={{padding: '325px 0px'}}>
                <Spinner />
            </div>
            }
            
        </Modal>
    )
}