import React from 'react'

import MuiPhoneNumber from 'material-ui-phone-number';

export default function PhoneInput({ label, name, value, onChange, ...props}) {
    const handleChange = (name, value) => onChange(name, value)
    return (
        <MuiPhoneNumber style={{ margin: '8px 0' }}
                        variant='outlined'
                        fullWidth
                        label={label}
                        defaultCountry={props.defaultCountry}
                        value={value}
                        onChange={phone => handleChange(name, phone)} />
    )
}

PhoneInput.defaultProps = {
    defaultCountry: 'ru'
}
