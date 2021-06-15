import React from 'react'
import './Edit.css'

const Edit = (props) => {
    return (
        <div 
        className="model"
        style={{
            transform:props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity:props.show ? '1' : '0'
        }}
        >
            {props.children}
        </div>
    )
}

export default Edit
