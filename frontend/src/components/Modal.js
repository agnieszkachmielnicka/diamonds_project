import React from 'react';

const Modal = ({ handleClose, show, children }) => {

    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <a onClick={handleClose}><i className="material-icons right close-button">close</i></a>
            </section>
        </div>
    );
}

export default Modal;