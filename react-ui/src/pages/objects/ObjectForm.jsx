import React from 'react'

import Dialog from '../../components/dialog/Dialog';
import Input from '../../components/dialog/controls/Input';

import axios from 'axios';


const serviceUrl = 'http://localhost:8000/api/guarded-objects/';

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
        <Dialog title='Редактировать объект'
            open={open}
            close={close}
            accept={handleAccept}
        >
            <Input label='Название'
                name='name'
                value={entity.name}
                onChange={onChange}
                isValid={entity.name !== undefined && entity.name.length !== 0}
                errorText='Не задано название' />
            <Input
                label='ИНН'
                name='itn'
                value={entity.itn}
                onChange={onChange}
                isValid={/^(\d{10}|\d{12})$/.test(entity.itn)}
                errorText='Введите корректный ИНН' />
        </Dialog>
    )
}
