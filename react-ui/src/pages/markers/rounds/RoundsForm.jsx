import React from 'react'

import { InputLabel, Select, FormControl } from "@material-ui/core";

import Dialog from '../../../components/dialog/Dialog';
import Input from '../../../components/dialog/controls/Input';

import * as genValidators from '../../../components/dialog/validators';

import axios from 'axios';

import * as enviroment from '../../../enviroment';

const serviceUrl = `${enviroment.apiHost}/api/rounds/`;

const timeRegexp = /\d{2}:\d{2}(:\d{2})?/;

const validators = {
    name: e => !genValidators.isEmpty(e.name),
    days: e => !genValidators.isEmpty(e.days),
    startTime: e => genValidators.isMatch(timeRegexp, e.start_time),
    endTime: e => genValidators.isEmpty(e.end_time) || genValidators.isMatch(timeRegexp, e.end_time),
    timeAllowance: e => genValidators.isMatch(/\d+/, e.time_allowance),
    lateTime: e => genValidators.isMatch(/\d+/, e.late_time),
}

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
        <Dialog title={`${entity.id? 'Изменить' : 'Добавить'} устройство`}
            open={open}
            close={close}
            accept={handleAccept}
            disabled={() => Object.values(validators).filter(valid => !valid(entity)).length > 0}
        >
            <Input label='Название' name='name' value={entity.name} onChange={onChange} isValid={validators.name(entity)} />
            <Input label='Дни обхода' name='days' value={entity.days} onChange={onChange} isValid={validators.days(entity)} />
            <Input label='Начало обхода' name='start_time' type='time' value={entity.start_time} onChange={onChange} isValid={validators.startTime(entity)} />
            <Input label='Конец обхода' name='end_time' type='time' value={entity.end_time} onChange={onChange} isValid={validators.endTime(entity)} />
            <Input label='Время допуска' name='time_allowance' type='number' value={entity.time_allowance} onChange={onChange} isValid={validators.timeAllowance(entity)} />
            <Input label='Время опоздания' name='late_time' type='number' value={entity.late_time} onChange={onChange} isValid={validators.lateTime(entity)} />

            {/* TODO: вынести в отдельный компонент. Необходимые пропертя:
                    id, label, value, onChange, options, isValid,  */}
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
