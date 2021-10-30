import React, { useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom";
import axios from "axios"

import ViewShop from "../ViewShop"
import Spinner from "react-bootstrap/Spinner";

const token = process.env.REACT_APP_API_SECRET

export default ({userId, isOwner, shoppingCart, setShoppingCart, isMaintenance}) => {
    const {shopUrl} = useParams()
    const [isUrlAvailible, setIsUrlAvailible] = useState(true)
    const [shopData, setShopData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/shop/link/${shopUrl}`, {token})
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
        <ViewShop isMaintenance={isMaintenance} shoppingCart={shoppingCart} setShoppingCart={setShoppingCart} shopData={shopData} isOwner={isOwner} userId={userId} /> :
        <div className="whitesmoke-bg-pnine" style={{paddingTop: '10px', paddingBottom: '200px'}}>
            <h3 style={{ marginTop: "20%" }} className="text-center">Pod adresou masvino.sk/{shopUrl} ešte neexistuje žiadna vináreň, ak si vinár a chceš u nás predávať, neváhaj nás <Link to="/kontakt">kontaktovať</Link>.</h3>
        </div>
        
    )
}