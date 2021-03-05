import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import ObchodnePodmienky from './ObchodnePodmienky';
import OchranaSukromia from './OchranaSukromia';
import ReklamacnyPoriadok from './ReklamacnyPoriadok';
import Doprava from './Doprava';

export default ({showLawPopup, setShowLawPopup}) => {
    return (
        <Modal size="lg" show={showLawPopup !== ''} onHide={() => setShowLawPopup('')}>
            <Modal.Body className="text-center" style={{fontSize: "90%", backgroundColor: 'whitesmoke'}}>
                {showLawPopup === 'obchodne' && <ObchodnePodmienky />}
                {showLawPopup === 'gdpr' && <OchranaSukromia />}
                {showLawPopup === 'reklamacny' && <ReklamacnyPoriadok />}
                {showLawPopup === 'doprava' && <Doprava />}
            </Modal.Body>
            <Modal.Footer className="row justify-content-center">
                <Button variant="dark" onClick={() => setShowLawPopup('')}>
                    Zavrieť
                </Button>
            </Modal.Footer>
        </Modal>
    )
}