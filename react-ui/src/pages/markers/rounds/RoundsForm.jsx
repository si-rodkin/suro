import React from 'react'

import { InputLabel, Select, FormControl } from "@material-ui/core";

import Dialog from '../../../components/dialog/Dialog';
import Input from '../../../components/dialog/controls/Input';

import axios from 'axios';

const serviceUrl = 'http://localhost:8000/api/rounds/';

export default function RoundsForm({ value, close, open, saveHandler, devices }) {
    const [entity, changeEntity] = React.useState({});
    const onChange = (name, value) => changeEntity({ ...entity, [name]: value });
    const onSelectChange = e => onChange(e.target.name, e.target.value);
    React.useEffect(() => changeEntity(value), [value]);

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

    return (
        <Dialog title='Редактировать устройство'
            open={open}
            close={close}
            accept={handleAccept}
        >
            <Input label='Название' name='name' value={entity.name} onChange={onChange} />
            <Input label='Дни обхода' name='days' value={entity.days} onChange={onChange} />
            <Input label='Начало обхода' name='start_time' type='time' value={entity.start_time} onChange={onChange} />
            <Input label='Конец обхода' name='end_time' type='time' value={entity.end_time} onChange={onChange} />
            <Input label='Время допуска' name='time_allowance' type='number' value={entity.time_allowance} onChange={onChange} />
            <Input label='Время опоздания' name='late_time' type='number' value={entity.late_time} onChange={onChange} />

            <FormControl variant="outlined" style={{ margin: '8px 0', width: '100%' }}>
                <InputLabel htmlFor="device-select">Устройство</InputLabel>
                <Select
                    native
                    value={entity.device}
                    onChange={onSelectChange}
                    label='Устройство'
                    name='device'
                    inputProps={{
                        id: 'device-select',
                    }}
                >
                    {devices.map(device => {
                        return (
                            <option value={device.id}>{device.name}</option>
                        )
                    })}
                </Select>
            </FormControl>
        </Dialog>
    )
}
