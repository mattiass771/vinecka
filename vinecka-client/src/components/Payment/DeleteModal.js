import axios from 'axios'
import React from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default ({setShowDeleteModal, showDeleteModal, deleteId}) => {

    const handleDeleteId = () => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/orders/${deleteId}`)
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