import React, { useState } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const ShiftHeader = (props) => {
    const [deleteMode, setDeleteMode] = useState(false);
    return (
        <header className="shifts__header">
            <p>{props.name}</p>
            {deleteMode ?
                <span>
                    <p>Delete shift ?</p>
                    <SvgIcon
                        component={DeleteOutlineIcon}
                    />
                    <SvgIcon
                        component={DeleteOutlineIcon}
                    />
                </span>

                :
                <SvgIcon
                    component={DeleteOutlineIcon}
                    onClick={(e) => { setDeleteMode(true); e.stopPropagation(); }}
                />
            }

        </header>
    )
}

export default ShiftHeader
