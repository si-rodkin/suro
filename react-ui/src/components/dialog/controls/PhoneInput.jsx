import React from 'react'

import MuiPhoneNumber from 'material-ui-phone-number';

const countries = [
    { code: 'ru', enName: 'Russia', ruName: 'Россия '},
    { code: 'ua', enName: 'Ukraine', ruName: 'Украина '},
    { code: 'by', enName: 'Belarus', ruName: 'Белорусия '},
]

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
                        onlyCountries={codes}
                        preferedContries={['ru']}
                        localization={localization}
                        onChange={phone => handleChange(name, phone)}
                        {...(!isValid && { error: !isValid, helperText: message })} />
    )
}

PhoneInput.defaultProps = {
    defaultCountry: 'ru'
}

let codes = countries.map(country => country.code);
let localization = {}

for (let country of countries) {
    localization = {...localization, [country.enName]: country.ruName}
}

const validateField = validators => {
    for (const validator of validators) {
        if (!validator.validate()) {
            return [false, validator.message];
        }
    }
    return [true, ''];
};
