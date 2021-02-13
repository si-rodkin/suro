import React from 'react'

import MuiPhoneNumber from 'material-ui-phone-number';

const validateField = validators => {
    for (const validator of validators) {
        if (!validator.validate()) {
            return [false, validator.message];
        }
    }
    return [true, ''];
};

export default function PhoneInput({ label, name, value, onChange, validators = [], ...props}) {
    const handleChange = (name, value) => onChange(name, value)

    const [isValid, message] = validateField(validators);

    return (
        <MuiPhoneNumber style={{ margin: '8px 0' }}
                        variant='outlined'
                        fullWidth
                        label={label}
                        defaultCountry={props.defaultCountry}
                        value={value}
                        onChange={phone => handleChange(name, phone)}
                        {...(!isValid && { error: !isValid, helperText: message })} />
    )
}

PhoneInput.defaultProps = {
    defaultCountry: 'ru'
}
