import React from 'react';

const Spinner = (props) => {
    return (
        <div className="spinner-circle" style={{ height: props.size, width: props.size }}>
            <div
                style={{
                    height: props.size - 14,
                    width: props.size - 14,
                    borderWidth: props.size / 10,
                    borderColor: props.color ? `${props.color} transparent transparent transparent` : '#fff transparent transparent transparent'
                }}
            />
            <div
                style={{
                    height: props.size - 14,
                    width: props.size - 14,
                    borderWidth: props.size / 10,
                    borderColor: props.color ? `${props.color} transparent transparent transparent` : '#fff transparent transparent transparent'
                }}
            />
            <div
                style={{
                    height: props.size - 14,
                    width: props.size - 14,
                    borderWidth: props.size / 10,
                    borderColor: props.color ? `${props.color} transparent transparent transparent` : '#fff transparent transparent transparent'
                }}
            />
            <div
                style={{
                    height: props.size - 14,
                    width: props.size - 14,
                    borderWidth: props.size / 10,
                    borderColor: props.color ? `${props.color} transparent transparent transparent` : '#fff transparent transparent transparent'
                }}
            />
        </div>
    )
}

export default Spinner;
//, borderColor: props.color ? #fff transparent transparent transparent : '#fff transparent transparent transparent'
//border-color: 