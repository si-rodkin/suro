import React from 'react'

import Dialog from '../../components/dialog/Dialog';
import Input from '../../components/dialog/controls/Input';

import * as genValidators from '../../components/dialog/validators';

import * as enviroment from '../../enviroment';

const serviceUrl = `${enviroment.apiHost}/api/guarded-objects/`;

const validators = {
    name: e => !genValidators.isEmpty(e.name),
    itn: e => genValidators.isMatch(/^(\d{10}|\d{12})$/, e.itn)
}

export default function ObjectForm({ value, open, close, create, update }) {
    const [entity, changeEntity] = React.useState({})
    const onChange = (name, value) => changeEntity({ ...entity, [name]: value });
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
                    action: entity.id? () => update(`${serviceUrl}${entity.id}/`, entity): () => create(serviceUrl, entity),
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
