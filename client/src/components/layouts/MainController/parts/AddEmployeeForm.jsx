import React, { Fragment, useState, useContext } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
//functions
import { generalPostRequest } from '../../../../functions/api';
//components
import CustomInput from '../../../globals/formComponents/CustomInput';
import Spinner from '../../../globals/spinners/Spinner';
//context
import { UserDataContext } from '../../../../contexts/UserDataContext';
//routes
import { ADD_EMPLOYEE } from '../../../../config/routes';

const AddEmployeeForm = () => {

    const { userData } = useContext(UserDataContext);
    const [addEmployeeFormData, setAddEmployeeFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    const handleEmployeeFormChange = (name, value) => {
        if (errors)
            setErrors(false);

        if (name === 'phone') {
            value = value.replace(/[^0-9+-]/g, '');
        }
        setAddEmployeeFormData({ ...addEmployeeFormData, [name]: value });
    }

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let body = { ...addEmployeeFormData, userId: userData._id }
        let addEmployeeResponse = await generalPostRequest(ADD_EMPLOYEE, body);
        if (addEmployeeResponse.status === 200) {
            setLoading(false);
            setErrors(false);
            setSuccessMessage(true);
            setAddEmployeeFormData({});
            setTimeout(() => {
                setSuccessMessage(false);
            }, 3000);

        } else {
            //set errors in state for display
            let errors = {};
            addEmployeeResponse.data.errors.map(err => { errors[err.param] = err.msg });
            setErrors(errors);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={submit} className="main-controller__settings--form">
            <h1>Add Employee</h1>
            <CustomInput
                name={'fullName'}
                placeholder={'Employee full name'}
                value={addEmployeeFormData['fullName']}
                onChange={handleEmployeeFormChange}
            />
            <CustomInput
                name={'phone'}
                placeholder={'Employee phone'}
                value={addEmployeeFormData['phone']}
                onChange={handleEmployeeFormChange}
            />
            <CustomInput
                name={'title'}
                placeholder={'Employee title'}
                value={addEmployeeFormData['title']}
                onChange={handleEmployeeFormChange}
            />
            {errors && errors['fullName'] ?
                <p className="main-controller__settings--form__errors">{errors['fullName']}</p>
                :
                null
            }
            <button style={successMessage ? { transform: 'scale(1.1)', transition: 'all .2s' } : { transition: 'all .2s' }}>
                {loading ?
                    <Fragment>
                        <Spinner size={40} />
                        <span>Saving...</span>
                    </Fragment>
                    :
                    successMessage ?
                        <Fragment>
                            <SvgIcon
                                style={{ fontSize: '2.5rem', marginRight: '0.6rem' }}
                                component={CheckCircleOutlineIcon}
                            />
                            <span>Saved!</span>
                        </Fragment>
                        :
                        <span>Add Employee</span>
                }
            </button>
        </form >
    )
}

export default AddEmployeeForm;
