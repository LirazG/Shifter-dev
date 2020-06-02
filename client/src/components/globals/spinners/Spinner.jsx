import React from 'react';

const Spinner = (props) => {
    return (
        <div className="spinner-circle" style={{ height: props.size, width: props.size }}>
            <div style={{ height: props.size - 14, width: props.size - 14, borderWidth: props.size / 10 }}></div>
            <div style={{ height: props.size - 14, width: props.size - 14, borderWidth: props.size / 10 }}></div>
            <div style={{ height: props.size - 14, width: props.size - 14, borderWidth: props.size / 10 }}></div>
            <div style={{ height: props.size - 14, width: props.size - 14, borderWidth: props.size / 10 }}></div>
        </div>
    )
}

export default Spinner;
