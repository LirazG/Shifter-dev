import React, { useState } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';

const ShiftHeader = (props) => {
    const [deleteMode, setDeleteMode] = useState(false);

    const handleDeleteClick = (e) => {
        setDeleteMode(true);
        e.stopPropagation();
    }

    const handleClearClick = (e) => {
        setDeleteMode(false);
        e.stopPropagation();
    }

    const handleDelete = (e) => {
        props.deleteShift(props.shiftIndex);
        e.stopPropagation();
    }

    return (
        <header className="settings-shifts__header">
            <p>{props.name}</p>
            {deleteMode ?
                <span className="settings-shifts__header__row">
                    <aside>
                        <span> Delete shift ? </span>
                        <span>(all data will be lost)</span>
                    </aside>
                    <SvgIcon
                        component={CheckIcon}
                        onClick={(e) => { handleDelete(e) }}
                    />
                    <SvgIcon
                        component={ClearIcon}
                        onClick={(e) => { handleClearClick(e) }}
                    />
                </span>
                :
                <SvgIcon
                    component={DeleteOutlineIcon}
                    onClick={(e) => { handleDeleteClick(e) }}
                />
            }

        </header>
    )
}

export default ShiftHeader
