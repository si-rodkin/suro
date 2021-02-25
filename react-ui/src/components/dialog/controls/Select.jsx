import React from 'react'

import { FormControl, Select, InputLabel, MenuItem } from '@material-ui/core';

const validateField = validators => {
    for (const validator of validators) {
        if (!validator.validate()) {
            return [false, validator.message];
        }
    }
    return [true, ''];
};

function SelectInput({label, value, onChange, name, id, options, validators = []}) {
    const [isValid, message] = validateField(validators);

    return (
        <FormControl variant="outlined" style={{ margin: '8px 0', width: '100%' }} {...(!isValid && { error: !isValid, helperText: message })}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <Select
                value={value}
                onChange={onChange}
                label={label}
                name={name}
                inputProps={{
                    id: {id},
                }}
            >
                {options.map(option => (
                    <MenuItem value={option.id}>{option.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default SelectInput;
