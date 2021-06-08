import React from 'react'

import { List, ListItem, ListItemIcon, Checkbox, ListItemText, Typography } from '@material-ui/core';
import Dialog from '../../components/dialog/Dialog';
import Input from '../../components/dialog/controls/Input';
import PhoneInput from '../../components/dialog/controls/PhoneInput';

import * as genValidators from '../../components/dialog/validators';

import * as enviroment from "../../enviroment";

const serviceUrl = `${enviroment.apiHost}/api/devices/`;

const validators = {
    name: entity => !genValidators.isEmpty(entity.name),
    imei: entity => genValidators.isMatch(/^\d{15}(,\d{15})*$/, entity.imei),
    phone: entity => genValidators.isPhone(entity.phone)
}

export default function DevicesForm({ value, close, open, create, update, guardRoutes }) {
    const [entity, changeEntity] = React.useState({});
    React.useEffect(() => changeEntity(value), [value]);
    const onChange = (name, value) => changeEntity({ ...entity, [name]: value })

    const routeClickHandle = (route) => {
        let routes = entity.guard_routes;

        if (routes.indexOf(route.id) === -1) {
            routes.push(route.id);
        } else {
            routes = routes.filter(routeId => routeId !== route.id);
        }

        changeEntity({ ...entity, guard_routes: routes });
    }

    return (
        <Dialog title={`${entity.id ? 'Изменить' : 'Добавить'} устройство`}
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
                        message: 'Введите название устройства'
                    },
                ]}
            />
            <Input label='IMEI'
                name='imei'
                value={entity.imei}
                onChange={onChange}
                validators={[
                    {
                        validate: () => validators.imei(entity),
                        message: 'Введите корректный IMEI'
                    },
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

            <Typography style={{ marginTop: '25px' }} component='h6'>
                Маршруты
                </Typography>
            <List>
                {guardRoutes.map(route => {
                    return (
                        <ListItem key={`${route.id}_${route.name}`} dense button onClick={() => routeClickHandle(route)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge='start'
                                    checked={entity.guard_routes?.indexOf(route.id) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText primary={`${route.name}`} />
                        </ListItem>
                    )
                })}
            </List>
        </Dialog>
    )
}
