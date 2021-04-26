import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import logo from './components/Navbar/logo5.png'

import { IoIosWine } from 'react-icons/io'
import { GiBabyBottle } from 'react-icons/gi'

export default ({initShow}) => {
    let history = useHistory()
    const [showed, setShowed] = useState(initShow)
    const handleConfirm = () => {
        window.localStorage.setItem('mas-vino-isAdult', true)
        return setShowed(false)
    }
    return (
        <Modal show={showed} onHide={() => null}>
            <div className="w-100 text-center" style={{backgroundColor: '#141a10'}} >
                <img src={logo} height="60%" width="60%"/>
            </div>
            <Modal.Body className="text-center" style={{fontSize: "150%", color: 'whitesmoke', backgroundColor: '#141a10'}}>Týmto potvrdzujem, že som plnoletý a môžem si legálne objednať víno.</Modal.Body>
            <Modal.Footer className="row justify-content-center">
                <Button variant="dark" onClick={() => history.goBack()}>
                    Nie som plnoletý&nbsp;  
                    <GiBabyBottle style={{fontSize: '175%'}} />
                </Button>
                <Button variant="dark" onClick={() => handleConfirm()}>
                    Som plnoletý <IoIosWine style={{fontSize: '175%'}} /> 
                </Button>
            </Modal.Footer>
        </Modal>
    )
}