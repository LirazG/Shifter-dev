import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import CloseIcon from '@material-ui/icons/Close';

const CustomModal = (props) => {
    return (
        <div className={props.active ? "custom-modal custom-modal--active" : "custom-modal"}>
            <aside className="custom-modal__curtain" onClick={props.cancelModal}></aside>
            <div className="custom-modal__content">
                <SvgIcon
                    component={CloseIcon}
                    className="custom-modal__content__close-icon"
                    onClick={props.cancelModal}
                />
                {props.children}
            </div>
        </div>
    )
}

export default CustomModal;