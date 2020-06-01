import React, { useState } from 'react';
import CustomInput from '../../../globals/formComponents/CustomInput';

const AddEmployeeForm = () => {

    const [addEmployeeFormData, setAddEmployeeFormData] = useState({});
    const handleEmployeeFormChange = (name, value) => {
        setAddEmployeeFormData({ ...addEmployeeFormData, [name]: value });
    }

    const submit = (e) => {
        e.preventDefault();
    }

    return (
        <form onSubmit={submit} className="main-controller__settings--form">
            <h1>Add Employee</h1>
            <CustomInput name={'fullName'} placeholder={'Employee full name'} value={addEmployeeFormData['fullName']} onChange={handleEmployeeFormChange} />
            <CustomInput name={'phone'} placeholder={'Employee phone'} value={addEmployeeFormData['phone']} onChange={handleEmployeeFormChange} />
            <CustomInput name={'title'} placeholder={'Employee title'} value={addEmployeeFormData['title']} onChange={handleEmployeeFormChange} />
            <button><span>Add</span></button>
        </form >
    )
}

export default AddEmployeeForm;
