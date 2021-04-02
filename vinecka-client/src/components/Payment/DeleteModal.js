import axios from 'axios'
import React from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const token = process.env.REACT_APP_API_SECRET

export default ({setShowDeleteModal, showDeleteModal, deleteId}) => {

    const handleDeleteId = () => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/orders/delete-order/${deleteId}`, {token})
            .then(res => {
                console.log(res.data)
                setShowDeleteModal(false)
            })
            .catch(err => err && console.log('Error deleting modal: ', err))
    }

    return (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Body>Naozaj chcete vymazat objednavku ID: {deleteId} ?</Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={() => setShowDeleteModal(false)}>
                    Zrusit
                </Button>
                <Button variant="dark" onClick={() => handleDeleteId()}>
                    Vymazat
                </Button>
            </Modal.Footer>
        </Modal>
    )
}