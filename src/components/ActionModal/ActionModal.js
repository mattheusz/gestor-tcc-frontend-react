import React from 'react';
import Modal from 'react-modal';
import Button from '../Button';

function ActionModal({ modalIsOpen, setModalIsOpen, modalMessage, handleConfirmAction }) {
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -70%)',
                    height: '180px', width: '500px', maxWidth: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around'
                },
                overlay: {
                    zIndex: '15',
                }
            }}
        >
            <h2>{modalMessage}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 15px' }}>
                <Button onClick={() => handleConfirmAction()}>Sim</Button>
                <Button onClick={() => setModalIsOpen(false)}>Cancelar</Button>
            </div>
        </Modal>
    );
}

export default ActionModal;