import React from 'react'

import { List, ListItem, ListItemIcon, Checkbox, ListItemText, Typography } from '@material-ui/core';
import Dialog from '../../components/dialog/Dialog';
import Input from '../../components/dialog/controls/Input';
import PhoneInput from '../../components/dialog/controls/PhoneInput';

import axios from 'axios';

import * as enviroment from '../../enviroment';

const serviceUrl = `${enviroment.apiHost}/api/devices/`;

export default function DevicesForm({ value, close, open, saveHandler, guardRoutes }) {
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
            <Input label='Название'
                name='name'
                value={entity.name}
                onChange={onChange}
                isValid={entity.name !== undefined && entity.name.length !== 0}
                errorText='Название должно быть задано' />
            <Input label='IMEI'
                name='imei'
                value={entity.imei}
                onChange={onChange}
                isValid={/^\d{15}(,\d{15})*$/.test(entity.imei)}
                errorText='Введите корректный IMEI' />
            <PhoneInput label='Телефон' name='phone' value={entity.phone} onChange={onChange} />

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
