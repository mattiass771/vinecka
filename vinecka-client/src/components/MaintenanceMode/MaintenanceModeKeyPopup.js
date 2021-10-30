import React, {useState} from 'react'
import axios from 'axios'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const token = process.env.REACT_APP_API_SECRET

export default ({maintenanceToggle, setMaintenanceToggle}) => {
    const [secretKey, setSecretKey] = useState('')
    const handleConfirm = (setMaintenanceMode) => {
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/home/toggle-maintenance-mode`, {secretKey, setMaintenanceMode, token})
            .then(res => {
                console.log(res.data)
                setMaintenanceToggle(false)
                window.location.reload()
            })
            .catch(err => console.log(err))
    }
    return (
        <Modal show={maintenanceToggle} onHide={() => setMaintenanceToggle(false)}>
            <Modal.Body className="text-center" style={{color: 'whitesmoke', backgroundColor: '#2c1111'}}>
                <label htmlFor="secretKey">Zadajte kľúč:</label>
                <input
                className={`form-control text-center`}
                placeholder="povinné"
                type="text"
                name="secretKey"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                />
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="danger" onClick={() => handleConfirm(true)}>
                    Zapnúť
                </Button>
                <Button variant="success" onClick={() => handleConfirm(false)}>
                    Vypnúť
                </Button>
            </Modal.Footer>
        </Modal>
    )
}