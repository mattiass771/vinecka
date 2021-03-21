import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios"

import ViewShop from "../ViewShop"
import Spinner from "react-bootstrap/Spinner";

export default ({userId, isOwner, updateCart, setUpdateCart}) => {
    const {shopUrl} = useParams()
    const [isUrlAvailible, setIsUrlAvailible] = useState(true)
    const [shopData, setShopData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`https://mas-vino.herokuapp.com/shop/link/${shopUrl}`)
            .then((res) => res.data ? setShopData(res.data) : setShopData({}))
            .catch((err) => err && console.log(err))
            .then(() => {
                if (shopData._id) setIsUrlAvailible(false)
                setLoading(false)
            })
    }, [])

    return (
        loading ? 
        <Spinner
          style={{ marginLeft: "49%", marginTop: "20%" }}
          animation="border"
        /> :
        isUrlAvailible && shopData._id ? 
        <ViewShop updateCart={updateCart} setUpdateCart={setUpdateCart} shopData={shopData} isOwner={isOwner} userId={userId} /> :
        <h5 style={{ marginTop: "20%" }} className="text-center">Pod adresou https://mas-vino.herokuapp.com/{shopUrl} ešte neexistuje žiadna vináreň, ak si vinár a chceš u nás predávať, neváhaj nás kontaktovať.</h5>
        
    )
}