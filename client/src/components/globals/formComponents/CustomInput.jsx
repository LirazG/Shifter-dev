// custom input props list
// value: value (str)
// type: input type for example: text, password (str)
// placeholder: placeholder (str)
// onChange: value change function
// customStyles: custom styles for the input (object)
// *************************************************** //

//dependencies
import React, { useState } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
//icon
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';

const CustomInput = (props) => {

    const [visiblePassword, setVisiblePassword] = useState(false)

    const changeHandler = (e) => {
        props.onChange(props.name, props.type === 'number' ? Number(e.target.value) : e.target.value)
    }

    const togglePasswordVisibility = () => {
        setVisiblePassword(!visiblePassword)
    }

    return (
        <div className="custom-input">
            <input
                type={props.type && !visiblePassword ? props.type : "text"}
                value={props.value ? props.value : ""}
                name={props.name}
                placeholder={props.placeholder ? props.placeholder : null}
                onChange={changeHandler}
            />

            {props.type === 'password' ?
                <SvgIcon
                    component={visiblePassword ? VisibilityOffOutlinedIcon : VisibilityOutlinedIcon}
                    className="custom-input__password-icon"
                    onClick={togglePasswordVisibility}
                />
                :
                null
            }
        </div>
    )
}

export default CustomInput
