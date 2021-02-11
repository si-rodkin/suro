import React from 'react'

import { List, ListItem, ListItemIcon, Checkbox, ListItemText, Typography } from '@material-ui/core';

import Dialog from '../../../components/dialog/Dialog';
import Input from '../../../components/dialog/controls/Input';

import * as genValidators from '../../../components/dialog/validators';

import axios from 'axios';

import * as enviroment from '../../../enviroment';

const validators = {
    name: e => !genValidators.isEmpty(e.name)
}

export default function RoutesForm({ markers, objectId, value, close, open, saveHandler }) {
    const [entity, changeEntity] = React.useState({});
    const onChange = (name, value) => changeEntity({ ...entity, [name]: value });

    React.useEffect(() => changeEntity(value), [value]);

    const handleAccept = () => {
        const apiUrl = `${enviroment.apiHost}/api/guard-routes/`
        const [method, url] = entity.id !== null ? ['PUT', `${apiUrl}${entity.id}/`] : ['POST', apiUrl];

        axios({
            method: method,
            url: url,
            data: { ...entity, guard_object: objectId }
        })
            .then(({ data }) => {
                saveHandler(data);
                close();
            })
            .catch((error) => alert('Ошибка при выполнении операции: ' + error));
    }

    const markerClickHandle = (marker) => {
        let markers = entity.markers;

        if (!markers.includes(marker.id)) {
            markers.push(marker.id);
        } else {
            markers = markers.filter(markerId => markerId !== marker.id)
        }

        changeEntity({ ...entity, markers: markers });
    }

    return (
        <Dialog title={`${entity.id ? 'Изменить' : 'Добавить'} маршрут`}
            open={open}
            close={close}
            accept={handleAccept}
            disabled={() => Object.values(validators).filter(valid => !valid(entity)).length > 0}
        >
            <Input label='Наименование'
                name='name'
                value={entity.name}
                onChange={onChange}
                isValid={validators.name(entity)}
                errorText='Введите наименование' />
            <Typography style={{ marginTop: '25px' }} component='h6'>
                Маркеры
                </Typography>
            <List>
                {markers.map(marker => {
                    return (
                        <ListItem key={`${marker.id}_${marker.name}`} dense button onClick={() => markerClickHandle(marker)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge='start'
                                    checked={entity.markers?.includes(marker.id)}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText primary={`${marker.name}`} />
                        </ListItem>
                    )
                })}
            </List>
        </Dialog>
    )
}
