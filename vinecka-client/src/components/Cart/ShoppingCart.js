import React, { useEffect, useState, useRef } from "react"
import axios from 'axios'
import { nanoid } from 'nanoid'

import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Spinner from "react-bootstrap/Spinner";

import PlaceOrder from './PlaceOrder'
import SignUp from '../Login/SignUp'
import Login from '../Login/Login'
import PayGate from './PayGate'

import { SlideDown } from "react-slidedown";
import "react-slidedown/lib/slidedown.css";

const OSOBNY = 'osobny'
const ROZVOZ = 'rozvoz'
const ROZVOZ_FIRST = 1.90
const ROZVOZ_SECOND = 3.90
const ZASIELKOVNA = 'zasielkovna'
const ZASIELKOVNA_PRICE = 4.90
const KURIER = 'kurier'
const KURIER_PRICE = 6.90

export default ({userId, updateCart, setUpdateCart}) => {
    const lastRef = useRef(null)
    const [shops, setShops] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [userInformation, setUserInformation] = useState('')
    const [login, setLogin] = useState(false)
    const [registration, setRegistration] = useState(false)
    const [shipmentOnly, setShipmentOnly] = useState(false)
    const [loading, setLoading] = useState(false)
    const [orderId, setOrderId] = useState(nanoid())
    const [passOrderInfo, setPassOrderInfo] = useState({})
    const [paymentPopup, setPaymentPopup] = useState(false)  
    const [checkedNewsletter, setCheckedNewsletter] = useState(false)
    const [deliveryCheck, setDeliveryCheck] = useState('')
    const [deliveryHover, setDeliveryHover] = useState('')
    const [boxCount, setBoxCount] = useState(0)
    const [isDeliveryFree, setIsDeliveryFree] = useState(false)
    const [localDeliveryPrice, setLocalDeliveryPrice] = useState('')

    const executeScroll = () => lastRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })   

    useEffect(() => {
        const {address} = userInformation;
        if (address) {
            if (address.match(/[šs]enkvice/ig) || address.match(/modra/ig) || address.match(/dubov[aá]/ig) || address.match(/sv[aä]t[yý][ ]{0,9}[jur]/ig) || address.match(/slovensk[yý][ ]{0,9}grob/ig) || address.match(/bratislava/ig) || address.match(/[čc]iern[aá][ ]{0,9}voda/ig)) { 
                if (!localDeliveryPrice) {
                    setLocalDeliveryPrice(ROZVOZ_SECOND)
                }
            } else if (address.match(/pezin[oe]k/ig) || address.match(/vinosady/ig) || address.match(/limbach/ig) || address.match(/vi[nň]i[čc]n[é]/ig)) {
                if (!localDeliveryPrice) {
                    setLocalDeliveryPrice(ROZVOZ_FIRST)
                }
            } else {
                if (localDeliveryPrice) {
                    setLocalDeliveryPrice('')
                }
            }
        }
    }, [userInformation])
 
    const sortItems = (cartItems) => {
        let sortShop = []
        for (let cartItem of cartItems) {
            axios.get(`https://mas-vino.herokuapp.com/shop/${cartItem.shopId}`)
                .then((res) => {
                    if (res.data && res.data.shopName) {
                        const { shopName, owner } = res.data
                        const itemsArr = res.data.shopItems
                        const { count, itemId } = cartItem
                        const findItem = itemsArr.find(el => el._id === cartItem.itemId)
                        if (findItem === undefined) {
                            axios.post(`https://mas-vino.herokuapp.com/users/${userId}/cart/delete-cart-item/${cartItem.shopId}/${cartItem.itemId}`)
                                .then((res) => console.log(res))
                                .catch(err => err && console.log('could not delete item', err))
                        } else {
                            const { itemName, price, imageLink } = findItem
                            setBoxCount(boxCount => boxCount+Number(count))
                            const index = sortShop.findIndex(el => el.shopId === cartItem.shopId)
                            if (index >= 0) {
                                const prevItems = sortShop[index].itemData
                                const isInCart = prevItems.findIndex(el => el.itemId === itemId)
                                if (isInCart !== -1) {
                                    const prevCount = sortShop[index].itemData[isInCart].count
                                    sortShop[index].itemData[isInCart].count = Number(count) + Number(prevCount)
                                } else {
                                    sortShop[index].itemData = [...prevItems, {itemId, itemName, price, imageLink, count}]
                                }
                            } else {
                                const newShopId = cartItem.shopId
                                sortShop = [...sortShop, {shopId: newShopId, shopName, owner, itemData: [{itemId, itemName, price, imageLink, count}]}]
                            }
                        }
                    }
                })
                .catch(err => {
                    if (err) return console.log(err)
                })
                .then(() => setShops([...sortShop]))
        }
    }

    useEffect(() => {
        setLoading(true)
    }, [])

    useEffect(() => {
        setBoxCount(0)
        setIsDeliveryFree(false)
        const localShoppingCart = localStorage.getItem('shoppingCart')
        if (userId) {
            const parsedShoppingCart = localShoppingCart ? JSON.parse(localShoppingCart) : []
            if (parsedShoppingCart.length !== 0) {
                const addItemsToShoppingCartFromLocal = async () => {
                    for (let cartItem of parsedShoppingCart) {
                        const {shopId, itemId, count} = cartItem
                        console.log('importing item ', itemId)
                        await axios
                            .post(`https://mas-vino.herokuapp.com/users/${userId}/cart/add-cart-item/${shopId}/${itemId}`, {
                                shopId, itemId, count
                            })
                            .then((res) => console.log(res))
                            .catch(err => err && console.log(err))
                    }
                    localStorage.removeItem('shoppingCart')
                    console.log('Importing done.')
                }
                addItemsToShoppingCartFromLocal()
            }
            axios
                .get(`https://mas-vino.herokuapp.com/users/${userId}`)
                .then((res) => {
                    if (res.data) {
                        const {shoppingCart, fullName, email, phone, address} = res.data
                        sortItems([...shoppingCart, ...parsedShoppingCart])
                        setUserInformation({ fullName, email, phone, address })
                    }
                })
                .catch(err => err && console.log(err))
                .then(() => setTimeout(() => setLoading(false), 2000))
        } else {
            const localShoppingCart = localStorage.getItem('shoppingCart')
            const sortPromise = new Promise((resolve, reject) => {
                resolve(sortItems(JSON.parse(localShoppingCart)))
            })
            
            localShoppingCart && sortPromise.then(res => {
                setTimeout(() => setLoading(false), 2000)
            })
        }
    }, [refresh])

    const getImage = (image) => {
        try {
          const img = `https://vineckabucket.s3.eu-central-1.amazonaws.com/${image.replace(/_/g, '-')}`
          return img;
        } catch {
          return null;
        }
    };

    const removeItemFromCart = (e, itemId, shopId) => {
        if (userId) {
            axios.post(`https://mas-vino.herokuapp.com/users/${userId}/cart/delete-cart-item/${shopId}/${itemId}`)
                .then((res) => {
                    const newShops = shops.map(shop => {
                        const newItemData = shop.itemData.filter(item => item.itemId !== itemId)
                        return {...shop, itemData: newItemData}
                    })
                    setShops(newShops)
                })
                .catch(err => err && console.log('could not delete item', err))
                .then(() => {
                    setUpdateCart(!updateCart)
                }) 
            if (shops.length === 1) setShops('')
        } else {
            const localShoppingCart = JSON.parse(localStorage.getItem('shoppingCart'))
            const newLocalShoppingCart = localShoppingCart.filter(item => item.itemId !== itemId)
            localStorage.removeItem('shoppingCart')
            if (newLocalShoppingCart.length !== 0) {
                localStorage.setItem('shoppingCart', JSON.stringify(newLocalShoppingCart))
                const newShops = shops.map(shop => {
                    const newItemData = shop.itemData.filter(item => item.itemId !== itemId)
                    return {...shop, itemData: newItemData}
                })
                setShops(newShops)
            } else {
                setShops('')
            }
            setUpdateCart(!updateCart)
        }
    }

    const showItemData = (itemData, shopId) => {
        const outputData = itemData.map((item, i) => {
            return (
                <Col className="float-left mt-2" data-id={`${item.itemId}`} xs={6} lg={4} key={`${item.itemId}`} style={{textAlign: "center"}}>
                    <Image src={getImage(item.imageLink) ? getImage(item.imageLink) : ''} rounded style={{height:75}} />
                    <h6>{item.itemName}</h6>
                    Počet: <strong>{item.count}</strong> <br/>
                    Cena: <strong>{item.price}</strong> €
                    <Button style={{position: 'absolute', right: "20%", top: 0}} onClick={(e) => removeItemFromCart(e, item.itemId, shopId)} variant="danger" size="sm">X</Button>
                </Col>
            )
        })
        return outputData
    }

    const getTotalPrice = (itemData) => {
        let total = 0
        for (let item of itemData) {
            total += Number((item.price).replace(/,/g,"."))*item.count
        }
        return total
    }

    const showCartItems = () => {
        const output = shops.sort((a, b) => (a.shopName > b.shopName) - (a.shopName < b.shopName)).map((shop, i) => {
            return (
                <Col 
                    key={shop.shopId} 
                    className={i%2 ? '' : 'border-custom-right'} 
                    style={{
                        paddingTop: "15px", 
                        paddingBottom: i !== shops.length-1 ? "25px" : '', 
                        borderTop: '2px solid #c1c1c1'
                    }} 
                    xs={12} 
                    md={6}
                >
                    <div style={{display: "flex", justifyContent:"space-between"}}>
                        <div>
                            <h4>{shop.shopName}</h4>
                        </div>
                        <div className="text-right">
                            <h5>Suma: {(getTotalPrice(shop.itemData)).toFixed(2).toString().replace(/\./g,',')} €</h5>
                        </div>
                    </div>
                    {showItemData(shop.itemData, shop.shopId)}
                </Col>
            )
        })
        if (!loading) {
            return output
        }
    }

    const createNewOrder = () => {
        let result = 0
        let deliveryPrice = 0
        shops.map(shop => (shop.itemData).map(item => result += (Number((item.price).replace(/,/g,"."))*item.count)))
        const total = result
        const status = 'vytvorena'
        switch (deliveryCheck) {
            case OSOBNY: break;
            case ROZVOZ: 
                result += localDeliveryPrice; 
                deliveryPrice += localDeliveryPrice;
                break;
            case ZASIELKOVNA: 
                result += ((Math.ceil(boxCount/6)*ZASIELKOVNA_PRICE)); 
                deliveryPrice += ((Math.ceil(boxCount/6)*ZASIELKOVNA_PRICE));
                break;
            case KURIER: 
                result += KURIER_PRICE; 
                deliveryPrice += KURIER_PRICE;
                break;
            default: break;
        }
        setPassOrderInfo({ orderId, userInformation, userId, shops, total, status, deliveryPrice, deliveryType: deliveryCheck })
        setPaymentPopup(true)
        axios.post(`https://mas-vino.herokuapp.com/orders/add`, { orderId, userInformation, userId, shops, total, status, deliveryPrice, deliveryType: deliveryCheck  })
            .then(res => {
                if (checkedNewsletter) {
                    axios.post(`https://mas-vino.herokuapp.com/mails/add`, {name: userInformation.fullName, email: userInformation.email})
                        .then(res => console.log(res))
                        .catch(err => err && console.log(err))
                }
            })
            .catch(err => err && console.log(err))
    }

    const handleRegistration = () => {
        setTimeout(() => executeScroll(),500)
        setLogin(false)
        setShipmentOnly(false)
        setRegistration(true)
    }

    const handleShipmentOnly = () => {
        setTimeout(() => executeScroll(),500)
        setLogin(false)
        setRegistration(false)
        setShipmentOnly(true)
    }

    const handleLogin = () => {
        setTimeout(() => executeScroll(),500)
        setRegistration(false)
        setShipmentOnly(false)
        setLogin(true)
    }

    const showDeliveryOptions = () => {
        return (
            <React.Fragment key={'showDeliveryOptions'}>
                <Row className="justify-content-center text-center">
                    <Col>
                        <h3>Výber doručenia</h3>
                    </Col>
                </Row>
                <Row 
                    style={{ 
                        color: deliveryCheck === OSOBNY ? 'whitesmoke' : ''
                        }} 
                    className="my-2"
                >
                    <Col 
                        md={{span: 4, offset: 2}}
                        style={{
                            backgroundColor: deliveryCheck === OSOBNY ? '#2b371b' : deliveryHover === OSOBNY ? '#c6c6c6' : '', 
                            cursor: 'pointer',
                            borderTopLeftRadius: '5px', 
                            borderBottomLeftRadius: '5px'
                        }} 
                        onMouseEnter={() => setDeliveryHover(OSOBNY)}
                        onMouseLeave={() => setDeliveryHover('')}
                        onTouchStart={() => setDeliveryHover(OSOBNY)}
                        onTouchEnd={() => setDeliveryHover('')}
                        onClick={() => setDeliveryCheck(deliveryCheck === OSOBNY ? '' : OSOBNY)}
                    >
                    <em>
                        <input 
                            style={{
                                cursor: 'pointer',
                                backgroundColor: deliveryCheck === OSOBNY ? 'red' : 'black'
                            }}
                            type='checkbox'
                            name='osobnyDeliveryCheck'
                            checked={deliveryCheck === OSOBNY}
                            onChange={() => setDeliveryCheck(deliveryCheck === OSOBNY ? '' : OSOBNY)}
                        />&nbsp;
                        Osobný odber v Pezinku:
                        </em>
                    </Col>
                    <Col 
                        style={{
                            backgroundColor: deliveryCheck === OSOBNY ? '#2b371b' : deliveryHover === OSOBNY ? '#c6c6c6' : '', 
                            cursor: 'pointer',
                            borderTopRightRadius: '5px', 
                            borderBottomRightRadius: '5px'
                        }}  
                        className="text-right" 
                        md={{span: 4}}
                        onMouseEnter={() => setDeliveryHover(OSOBNY)}
                        onMouseLeave={() => setDeliveryHover('')}
                        onTouchStart={() => setDeliveryHover(OSOBNY)}
                        onTouchEnd={() => setDeliveryHover('')}
                        onClick={() => setDeliveryCheck(deliveryCheck === OSOBNY ? '' : OSOBNY)}
                    >
                        <strong>zadarmo</strong>
                    </Col>
                </Row>
                <SlideDown className={"my-dropdown-slidedown"}>
                {localDeliveryPrice &&
                    <Row 
                        style={{ 
                            color: deliveryCheck === ROZVOZ ? 'whitesmoke' : ''
                            }} 
                        className="my-2"
                    >
                        
                        <Col 
                            style={{
                                backgroundColor: deliveryCheck === ROZVOZ ? '#2b371b' : deliveryHover === ROZVOZ ? '#c6c6c6' : '', 
                                cursor: 'pointer',
                                borderTopLeftRadius: '5px', 
                                borderBottomLeftRadius: '5px'
                            }} 
                            md={{span: 3, offset: 2}}
                            onMouseEnter={() => setDeliveryHover(ROZVOZ)}
                            onMouseLeave={() => setDeliveryHover('')}
                            onTouchStart={() => setDeliveryHover(ROZVOZ)}
                            onTouchEnd={() => setDeliveryHover('')}
                            onClick={() => setDeliveryCheck(deliveryCheck === ROZVOZ ? '' : ROZVOZ)}
                        >
                            <em>
                            <input 
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: deliveryCheck === ROZVOZ ? 'red' : 'black'
                                }}
                                type='checkbox'
                                name='dovozDeliveryCheck'
                                checked={deliveryCheck === ROZVOZ}
                                onChange={() => setDeliveryCheck(deliveryCheck === ROZVOZ ? '' : ROZVOZ)}
                            />&nbsp;
                            Náš rozvoz:
                            </em>
                        </Col>
                        <Col 
                            style={{
                                backgroundColor: deliveryCheck === ROZVOZ ? '#2b371b' : deliveryHover === ROZVOZ ? '#c6c6c6' : '', 
                                cursor: 'pointer',
                                borderTopRightRadius: '5px', 
                                borderBottomRightRadius: '5px'
                            }} 
                            className="text-right" 
                            md={{span: 5}}
                            onMouseEnter={() => setDeliveryHover(ROZVOZ)}
                            onMouseLeave={() => setDeliveryHover('')}
                            onTouchStart={() => setDeliveryHover(ROZVOZ)}
                            onTouchEnd={() => setDeliveryHover('')}
                            onClick={() => setDeliveryCheck(deliveryCheck === ROZVOZ ? '' : ROZVOZ)}
                        >
                            Bratislava, Pezinok, Vinosady, Limbach, Viničné - <strong>{isDeliveryFree ? 'zadarmo' : '1,90 €'}</strong><br/>
                            Modra, Šenkvice, Slovenský Grob,<br /> Svätý Jur, Dubová, Čierna Voda - <strong>{isDeliveryFree ? 'zadarmo' : '3,90 €'}</strong>
                        </Col>
                    </Row>}
                </SlideDown>
                <Row 
                    style={{ 
                        color: deliveryCheck === ZASIELKOVNA ? 'whitesmoke' : ''
                        }} 
                    className="my-2"
                >
                    <Col 
                        style={{
                            backgroundColor: deliveryCheck === ZASIELKOVNA ? '#2b371b' : deliveryHover === ZASIELKOVNA ? '#c6c6c6' : '', 
                            cursor: 'pointer',
                            borderTopLeftRadius: '5px', 
                            borderBottomLeftRadius: '5px'
                        }} 
                        md={{span: 3, offset: 2}}
                        onMouseEnter={() => setDeliveryHover(ZASIELKOVNA)}
                        onMouseLeave={() => setDeliveryHover('')}
                        onTouchStart={() => setDeliveryHover(ZASIELKOVNA)}
                        onTouchEnd={() => setDeliveryHover('')}
                        onClick={() => setDeliveryCheck(deliveryCheck === ZASIELKOVNA ? '' : ZASIELKOVNA)}
                    >
                        <em>
                        <input 
                            style={{
                                cursor: 'pointer',
                                backgroundColor: deliveryCheck === ZASIELKOVNA ? 'red' : 'black'
                            }}
                            type='checkbox'
                            name='dovozDeliveryCheck'
                            checked={deliveryCheck === ZASIELKOVNA}
                            onChange={() => setDeliveryCheck(deliveryCheck === ZASIELKOVNA ? '' : ZASIELKOVNA)}
                        />&nbsp;
                        Zásielkovňa:
                        </em>
                    </Col>
                    <Col 
                        style={{
                            backgroundColor: deliveryCheck === ZASIELKOVNA ? '#2b371b' : deliveryHover === ZASIELKOVNA ? '#c6c6c6' : '', 
                            cursor: 'pointer',
                            borderTopRightRadius: '5px', 
                            borderBottomRightRadius: '5px'
                        }} 
                        className="text-right" 
                        md={{span: 5}}
                        onMouseEnter={() => setDeliveryHover(ZASIELKOVNA)}
                        onMouseLeave={() => setDeliveryHover('')}
                        onTouchStart={() => setDeliveryHover(ZASIELKOVNA)}
                        onTouchEnd={() => setDeliveryHover('')}
                        onClick={() => setDeliveryCheck(deliveryCheck === ZASIELKOVNA ? '' : ZASIELKOVNA)}
                    >
                        Od váhy, každá krabica (6 fliaš) vlastné poštovné - <strong>{isDeliveryFree ? 'zadarmo' : `${((Math.ceil(boxCount/6)*ZASIELKOVNA_PRICE)).toFixed(2)} €`}</strong> <br />
                        Fliaš: <strong>{boxCount}</strong>, Krabíc: <strong>{Math.ceil(boxCount/6)}</strong>.
                    </Col>
                </Row>
                <Row 
                    style={{ 
                        color: deliveryCheck === KURIER ? 'whitesmoke' : ''
                        }} 
                    className="my-2"
                >
                    <Col 
                        style={{
                            backgroundColor: deliveryCheck === KURIER ? '#2b371b' : deliveryHover === KURIER ? '#c6c6c6' : '', 
                            cursor: 'pointer',
                            borderTopLeftRadius: '5px', 
                            borderBottomLeftRadius: '5px'
                        }} 
                        md={{span: 3, offset: 2}}
                        onMouseEnter={() => setDeliveryHover(KURIER)}
                        onMouseLeave={() => setDeliveryHover('')}
                        onTouchStart={() => setDeliveryHover(KURIER)}
                        onTouchEnd={() => setDeliveryHover('')}
                        onClick={() => setDeliveryCheck(deliveryCheck === KURIER ? '' : KURIER)}
                    >
                        <em>
                        <input 
                            style={{
                                cursor: 'pointer',
                                backgroundColor: deliveryCheck === KURIER ? 'red' : 'black'
                            }}
                            type='checkbox'
                            name='dovozDeliveryCheck'
                            checked={deliveryCheck === KURIER}
                            onChange={() => setDeliveryCheck(deliveryCheck === KURIER ? '' : KURIER)}
                        />&nbsp;
                        Kuriér:
                        </em>
                    </Col>
                    <Col 
                        style={{
                            backgroundColor: deliveryCheck === KURIER ? '#2b371b' : deliveryHover === KURIER ? '#c6c6c6' : '', 
                            cursor: 'pointer',
                            borderTopRightRadius: '5px', 
                            borderBottomRightRadius: '5px'
                        }} 
                        className="text-right" 
                        md={{span: 5}}
                        onMouseEnter={() => setDeliveryHover(KURIER)}
                        onMouseLeave={() => setDeliveryHover('')}
                        onTouchStart={() => setDeliveryHover(KURIER)}
                        onTouchEnd={() => setDeliveryHover('')}
                        onClick={() => setDeliveryCheck(deliveryCheck === KURIER ? '' : KURIER)}
                    >
                        <strong>{isDeliveryFree ? 'zadarmo' : '6,90 €'}</strong>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }


    const showTotalCartPrice = () => {
        let result = 0
        shops.map(shop => (shop.itemData).map(item => result += (Number((item.price).replace(/,/g,"."))*item.count)))
        if (result >= 150 && !isDeliveryFree) {
            setIsDeliveryFree(true)
        } else if (result < 150 && isDeliveryFree) {
            setIsDeliveryFree(false)
        }
        const resWithoutDelivery = result
        switch (deliveryCheck) {
            case OSOBNY: break;
            case ROZVOZ: result += localDeliveryPrice; break;
            case ZASIELKOVNA: result += ((Math.ceil(boxCount/6)*ZASIELKOVNA_PRICE)); break;
            case KURIER: result += KURIER_PRICE; break;
            default: break;
        }
        return (
            <Col>
                <h3>Finálna suma: {result.toFixed(2).toString().replace(/\./g,',')} €</h3>
                {resWithoutDelivery < 150 ? <p style={{fontSize: '125%'}}>Nakúpte ešte za <strong>{(150 - resWithoutDelivery).toFixed(2)} €</strong> a dopravu máte zadarmo.</p> : 
                <p style={{fontSize: '125%'}}>Dopravu máte <strong>zadarmo</strong>.</p>}
            </Col>
        )
    }

    return (
        <div className="whitesmoke-bg-pnine" style={{minHeight: '500px'}}>
            {loading &&
                <Spinner
                    style={{ marginLeft: "49%", marginTop: "250px"}}
                    animation="border"
                />}
            <SlideDown className={"my-dropdown-slidedown"}>
                <Container style={{paddingTop: "50px", paddingBottom: "50px"}}>
                    { passOrderInfo && paymentPopup &&
                        <PayGate orderInfo={passOrderInfo} setPaymentPopup={setPaymentPopup} paymentPopup={paymentPopup} />
                    }
                    <Row style={{borderBottom: !loading && '2px solid #c1c1c1'}}>
                        {shops && showCartItems()}
                        
                    </Row>
                    {!loading && 
                    <Row className="text-center pt-4">
                        <Col>
                            {(!userInformation && shops ) &&
                                <p>
                                    <Button className="mt-2" onClick={() => handleRegistration()} variant="dark">Doručovacie údaje s registráciou</Button>
                                    &nbsp;&nbsp;
                                    <Button className="mt-2" onClick={() => handleLogin()} variant="dark">Mám účet a chcem sa prihlásit</Button>
                                    &nbsp;&nbsp;
                                    <Button className="mt-2" onClick={() => handleShipmentOnly()} variant="dark">Doručovacie údaje bez registrácie</Button>
                                </p>
                            }
                        </Col>
                    </Row>}
                    <Row ref={lastRef} className="text-center">
                        {login && <Login shoppingCart={true} />}
                        {registration && <SignUp shoppingCart={true} handleLogin={handleLogin} />}
                        {shipmentOnly && <PlaceOrder checkedNewsletter={checkedNewsletter} setCheckedNewsletter={setCheckedNewsletter} setUserInformation={setUserInformation} />}
                    </Row>
                    <SlideDown className={"my-dropdown-slidedown"}>
                        {shops && userInformation && showDeliveryOptions()}
                    </SlideDown>
                    {!loading && 
                    <Row className="text-center">
                        <br />
                        <br />
                        {shops && showTotalCartPrice()}
                    </Row>}
                    {!loading && 
                    <Row className="text-center">
                        <Col>
                            {deliveryCheck && userInformation && shops.length > 0 ?
                                <Button onClick={() => createNewOrder()} variant="dark">Prejsť k platbe</Button>
                            :
                            <>  
                                {shops.length === 0 && 
                                    <>
                                        <h4>Nákupný košík je momentálne prázdny.</h4>
                                        <br />
                                        <br />
                                    </>
                                }
                                <Button disabled variant="dark">Vyplňte údaje pre doručenie</Button>
                            </>
                        }
                        </Col>
                    </Row>}
                </Container>
            </SlideDown>
        </div>
    )
}