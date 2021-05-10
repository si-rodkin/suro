import React from "react";
import axios from "axios";
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from "../../components/dialog/Dialog";
import Input from "../../components/dialog/controls/Input";
import PhoneInput from "../../components/dialog/controls/PhoneInput";
import * as genValidators from "../../components/dialog/validators";
import * as enviroment from '../../enviroment';

const validators = {
    pNumber: entity => !genValidators.isEmpty(entity.personnel_number),
    lastName: entity => !genValidators.isEmpty(entity.last_name),
    firstName: entity => !genValidators.isEmpty(entity.first_name),
    phone: entity => genValidators.isPhone(entity.phone),
    username: entity => !genValidators.isEmpty(entity.username),
    email: entity => !genValidators.isEmail(entity.email),
    position: entity => !genValidators.isEmpty(entity.position),
}

const serviceUrl = `${enviroment.apiHost}/api/users/`;

function EmployeeForm({ value, close, open, saveHandler, lead }) {
    const [entity, changeEntity] = React.useState({});
    React.useEffect(() => changeEntity(value), [value]);
    const onChange = (name, value) => changeEntity({ ...entity, [name]: value })

    const handleAccept = () => {
        entity.lead = lead;
        axios({
            method: entity.id !== null ? 'PUT' : 'POST',
            url: entity.id !== null ? `${serviceUrl}${entity.id}/` : serviceUrl,
            data: entity
        }).then(({ data }) => {
            saveHandler(data);
            close();
        }).catch((error) => alert('Ошибка при выполнении операции: ' + error));
    }

    return (
        <Dialog
            open={open}
            title='Профиль пользователя'
            buttons={[
                {
                    label: 'Закрыть',
                    action: close
                },
                {
                    label: 'Сохранить',
                    action: handleAccept,
                    color: 'primary',
                    disabled: () => Object.values(validators).filter(valid => !valid(entity)).length > 0
                }
            ]}
        >
            <Input label='Табельный номер'
                name='personnel_number'
                value={entity.personnel_number}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.pNumber(entity),
                        message: 'Укажите корректный персональный номер'
                    }
                ]}
                type='number'
            />

            <Input label='Фамилия'
                name='last_name'
                value={entity.last_name}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.lastName(entity),
                        message: 'Укажите фамилию'
                    }
                ]}
            />

            <Input label='Имя'
                name='first_name'
                value={entity.first_name}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.firstName(entity),
                        message: 'Укажите имя'
                    }
                ]}
            />

            <Input label='Отчество'
                name='patr_name'
                value={entity.patr_name}
                onChange={onChange}
            />

            <Input label='Позиция'
                name='position'
                value={entity.position}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.position(entity),
                        message: 'Укажите должность'
                    }
                ]}
            />

            <PhoneInput label='Телефон'
                name='phone'
                value={entity.phone}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.phone(entity),
                        message: 'Введите корректный номер телефона'
                    }
                ]}
            />

            <Input label='E-mail'
                name='email'
                value={entity.email}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.email(entity),
                        message: 'Введите корректный адрес электронной почты'
                    }
                ]} />

            {/* timezone: timezone input (probably select TODO) */}

            <Input label='Имя пользователя'
                name='username'
                value={entity.username}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.username(entity),
                        message: 'Укажите имя пользователя'
                    }
                ]}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={entity.is_leading}
                        onChange={e => {console.log(e.target); onChange('is_leading', e.target.checked)}}
                    />
                }
                label="Имеет подчиненных"
            />

        </Dialog>
    )
}

const mapStateToProps = (state) => {
    return {
        lead: state.user?.id
    }
}

export default connect(mapStateToProps, null)(EmployeeForm)

