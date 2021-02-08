import React, {useEffect, useState } from 'react'
import axios from 'axios'


export default ({userId}) => {
    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:5000/users/${userId}/cart/clear-cart`)
                .then(res => console.log(res.data))
                .catch(error => error && console.log(error))
        }
        localStorage.removeItem('shoppingCart')
    }, [])
    
    return (
        <p>payment success</p>
    )
}