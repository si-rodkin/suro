import React from 'react'

import Dialog from '../../../components/dialog/Dialog';
import Input from '../../../components/dialog/controls/Input';
import SelectInput from '../../../components/dialog/controls/Select';

import * as genValidators from '../../../components/dialog/validators';

import axios from 'axios';

import * as enviroment from '../../../enviroment';
import { weekDays } from '../../../utils/dictionaries';

const serviceUrl = `${enviroment.apiHost}/api/rounds/`;

const timeRegexp = /\d{2}:\d{2}(:\d{2})?/;

const validators = {
    name: e => !genValidators.isEmpty(e.name),
    startTime: e => genValidators.isMatch(timeRegexp, e.start_time),
    endTime: e => genValidators.isEmpty(e.end_time) || genValidators.isMatch(timeRegexp, e.end_time),
    timeAllowance: e => genValidators.isMatch(/\d+/, e.time_allowance) && Number(e.time_allowance) >= 0,
    lateTime: e => genValidators.isMatch(/\d+/, e.late_time) && Number(e.late_time) >= 0,
    device: e => !genValidators.isEmpty(e.device),
    days: e => !genValidators.isEmpty(e.days),
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
        }).catch((error) => alert('Ошибка при выполнении операции: ' + error.data));
    }

    return (
        <Dialog title={`${entity.id ? 'Изменить' : 'Добавить'} обход`}
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
                        message: 'Введите название'
                    },
                ]}
            />

            <SelectInput id='day-select'
                label='День обхода'
                name='days'
                value={entity.days}
                onChange={onSelectChange}
                options={weekDays.map((day, index) => { return { id: index, name: day }; })}
                validators={[
                    {
                        validate: () => validators.days(entity),
                        message: 'Выберите день обхода'
                    }
                ]}
            />

            <Input
                label='Начало обхода'
                name='start_time'
                type='time'
                value={entity.start_time}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.startTime(entity),
                        message: 'Заполните время начала обхода'
                    },
                ]}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Input
                label='Конец обхода'
                name='end_time'
                type='time'
                value={entity.end_time}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.endTime(entity),
                        message: 'Введите верное время конца обхода'
                    },
                ]}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Input label='Время допуска'
                name='time_allowance'
                type='number'
                value={entity.time_allowance}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.timeAllowance(entity),
                        message: 'Введите корректное время допуска'
                    },
                ]}
            />

            <Input label='Время опоздания'
                name='late_time'
                type='number'
                value={entity.late_time}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.lateTime(entity),
                        message: 'Введите корректное время опоздания'
                    },
                ]}
            />

            <SelectInput id='device-select'
                label='Устройство'
                name='device'
                value={entity.device}
                onChange={onSelectChange}
                options={devices.map(device => {return { id: device.id, name: device.name }})}

                validators={[
                    {
                        validate: () => validators.device(entity),
                        message: 'Выберите устройство обхода'
                    }
                ]}
            />
        </Dialog>
    )
}
