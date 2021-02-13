import { TextField } from '@material-ui/core'
import React from 'react'

const validateField = validators => {
    for (const validator of validators) {
        if (!validator.validate()) {
            return [false, validator.message];
        }
    }
    return [true, ''];
};

export default function Input({ label, name, value, onChange, type = 'text', validators = [] }) {
    const handleOnChange = e => {
        const { name, value } = e.target;
        onChange(name, value);
    }

    const [isValid, message] = validateField(validators);

    return (
        <TextField style={{ margin: '8px 0' }}
            type={type}
            fullWidth
            variant='outlined'
            name={name}
            value={value}
            label={label}
            onChange={handleOnChange}

            {...(!isValid && { error: !isValid, helperText: message })} />
    )
}
