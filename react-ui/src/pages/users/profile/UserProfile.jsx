import React from 'react'

import Dialog from '../../../components/dialog/Dialog';
import Input from '../../../components/dialog/controls/Input';
import PhoneInput from '../../../components/dialog/controls/PhoneInput';

import * as genValidators from '../../../components/dialog/validators';
import * as enviroment from '../../../enviroment';

import axios from 'axios';

const validators = {
    pNumber: entity => !genValidators.isEmpty(entity.personnel_number),
    lastName: entity => !genValidators.isEmpty(entity.last_name),
    firstName: entity => !genValidators.isEmpty(entity.first_name),
    phone: entity => genValidators.isPhone(entity.phone),
    username: entity => !genValidators.isEmpty(entity.username),
    email: entity => !genValidators.isEmail(entity.email),
    position: entity => !genValidators.isEmpty(entity.position),
}

export default function UserProfile({ open, close }) {
    const [user, setUser] = React.useState({});

    const onChange = (name, value) => setUser({ ...user, [name]: value });
    const handleAccept = () => {
        axios.put(`${enviroment.apiHost}/api/users/${user.id}/`, {...user, timezone: 'Europe/Moscow'})
            .then(({ data }) => setUser(data))
            .catch(error => alert(error));
    }

    React.useEffect(() => {
        axios.get(`${enviroment.apiHost}/api/user/`, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        })
            .then(response => setUser(response.data))
            .catch(error => console.log(error))
    }, [open])

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
                    disabled: () => Object.values(validators).filter(valid => !valid(user)).length > 0
                }
            ]}
        >
            <Input label='Табельный номер'
                name='personnel_number'
                value={user.personnel_number}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.pNumber(user),
                        message: 'Укажите корректный персональный номер'
                    }
                ]}
                type='number'
            />

            <Input label='Фамилия'
                name='last_name'
                value={user.last_name}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.lastName(user),
                        message: 'Укажите фамилию'
                    }
                ]}
            />

            <Input label='Имя'
                name='first_name'
                value={user.first_name}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.firstName(user),
                        message: 'Укажите имя'
                    }
                ]}
            />

            <Input label='Отчество'
                name='patr_name'
                value={user.patr_name}
                onChange={onChange}
            />

            <Input label='Позиция'
                name='position'
                value={user.position}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.position(user),
                        message: 'Укажите позицию'
                    }
                ]}
            />

            <PhoneInput label='Телефон'
                name='phone'
                value={user.phone}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.phone(user),
                        message: 'Введите корректный номер телефона'
                    }
                ]}
            />

            <Input label='E-mail'
                name='email'
                value={user.email}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.email(user),
                        message: 'Введите корректный адрес электронной почты'
                    }
                ]} />

            {/* timezone: timezone input (probably select TODO) */}

            <Input label='Имя пользователя'
                name='username'
                value={user.username}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.username(user),
                        message: 'Укажите имя пользователя'
                    }
                ]}
            />

        </Dialog>
    )
}
