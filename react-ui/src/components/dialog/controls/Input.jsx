import { TextField } from '@material-ui/core'
import React from 'react'


export default function Input({ label, name, value, onChange, type = 'text', isValid = () => true, errorText = '' }) {
    const handleOnChange = e => {
        const { name, value } = e.target;
        onChange(name, value);
    }

    return (
        <TextField style={{ margin: '8px 0' }}
            type={type}
            fullWidth
            variant='outlined'
            name={name}
            value={value}
            label={label}
            onChange={handleOnChange}

            {...(!isValid && { error: true, helperText: errorText })} />
    )
}
