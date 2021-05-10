import React from 'react'

import Dialog from '../../../components/dialog/Dialog';
import PasswordInput from '../../../components/dialog/controls/PasswordInput';

import * as enviroment from '../../../enviroment';

import axios from 'axios';

const validators = {
    password: entity => entity.password?.length > 5,
    passwordRepeat: entity => entity.password === entity.passwordRepeat
}

export default function ChangePassoword({ open, close, userId }) {
    const [user, setUser] = React.useState({});

    const onChange = (name, value) => setUser({ ...user, [name]: value });
    const handleAccept = () => {
        axios.put(`${enviroment.apiHost}/api/users/${user.id}/`, {...user, timezone: 'Europe/Moscow'})
            .then(({ data }) => close())
            .catch(error => alert(error));
    }

    React.useEffect(() => {
        axios.get(`${enviroment.apiHost}/api/users/${userId}/`, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        })
            .then(response => setUser(response.data))
            .catch(error => console.log(error))
    }, [open, userId])

    return (
        <Dialog
            open={open}
            title='Смена пароля пользователя'
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
            <PasswordInput
                label='Пароль'
                name='password'
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.password(user),
                        message: 'Пароль должен сожержать не менее 6 символов!'
                    }
                ]}
            />
            <PasswordInput
                label='Повторите пароль'
                name='passwordRepeat'
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.passwordRepeat(user),
                        message: 'Пароли не совпадают'
                    }
                ]}
            />

        </Dialog>
    )
}
