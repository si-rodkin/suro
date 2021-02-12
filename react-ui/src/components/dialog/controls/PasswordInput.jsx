import React from 'react'

import { TextField, IconButton } from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export default function PasswordInput({ label, name, value, onChange, validators = [] }) {
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState({state: false, message: ''});

    const handleOnChange = e => {
        const {name, value} = e.target;
        onChange(name, value);
    }

    const [isValid, message] = (() => {
        for (const validator of validators) {
            if (!validator.validate()) {
                return [false, validator.message];
            }
        }
        return [true, ''];
    })();

    return (
        <TextField style={{ margin: '8px 0' }}
            fullWidth
            variant='outlined'
            type={showPassword ? 'text' : 'password'}
            label={label}
            name={name}
            value={value}
            onChange={handleOnChange}
            InputProps={{
                endAdornment: (<IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>)
            }}
            {...(!isValid && { error: !isValid, helperText: message })} />
    )
}
