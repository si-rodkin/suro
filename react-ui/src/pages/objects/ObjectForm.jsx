import React from 'react'

import Dialog from '../../components/dialog/Dialog';
import Input from '../../components/dialog/controls/Input';

import * as genValidators from '../../components/dialog/validators';

import axios from 'axios';

import * as enviroment from '../../enviroment';

const serviceUrl = `${enviroment.apiHost}/api/guarded-objects/`;

const validators = {
    name: e => !genValidators.isEmpty(e.name),
    itn: e => genValidators.isMatch(/^(\d{10}|\d{12})$/, e.itn)
}

export default function ObjectForm({ value, open, close, saveHandler }) {
    const [entity, changeEntity] = React.useState({})
    const onChange = (name, value) => changeEntity({ ...entity, [name]: value });
    const handleAccept = () => {
        axios({
            method: entity.id !== null ? 'PUT' : 'POST',
            url: entity.id !== null ? `${serviceUrl}${entity.id}/` : serviceUrl,
            data: entity
        }).then(({ data }) => {
            saveHandler(data);
            close();
        }).catch((error) => alert('Ошибка при выполнении операции: ' + error));
    }

    React.useEffect(() => changeEntity(value), [value]);

    return (
        <Dialog title={`${entity.id? 'Изменить' : 'Добавить'} объект`}
            open={open}
            buttons={[
                {
                    label: 'Закрыть',
                    action: close,
                },
                {
                    label: 'Сохранить',
                    action: handleAccept,
                    color: 'primary',
                    disabled: () => Object.values(validators).filter(valid => !valid(entity)).length > 0
                }
            ]}
        >
            <Input label='Название'
                name='name'
                value={entity.name}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.name(entity),
                        message: 'Не задано название'
                    },
                ]}
            />
            <Input
                label='ИНН'
                name='itn'
                value={entity.itn}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.itn(entity),
                        message: 'Введите корректный ИНН'
                    },
                ]}
            />
        </Dialog>
    )
}
