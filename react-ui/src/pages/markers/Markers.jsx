import React from "react";
import { Button, Container, DialogContentText } from '@material-ui/core';
import { TableCell, TableRow } from '@material-ui/core';

import Table from "../../components/table/Table";
import Dialog from '../../components/dialog/Dialog';
import Input from '../../components/dialog/controls/Input';
import Menu from './Menu';

import Edit from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import axios from 'axios';

import * as genValidators from '../../components/dialog/validators';
import * as enviroment from '../../enviroment';

const serviceUrl = `${enviroment.apiHost}/api/markers/`;

const validators = {
    name: ({ name }) => !genValidators.isEmpty(name)
}

export default function Markers(props) {
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingEntity, setEditingEntity] = React.useState({});
    const [createMarkerModeOn, setCreateMarkerMode] = React.useState(false);

    const onChange = (name, value) => setEditingEntity({ ...editingEntity, [name]: value });

    console.log(props)

    const switchCreateMarkerMode = () => {
        axios.post(`${enviroment.apiHost}/api/switch-marker-check-mode/`)
            .then(() => setCreateMarkerMode(!createMarkerModeOn))
            .catch(error => alert(error));
        axios({
            method: 'GET',
            url: serviceUrl
        })
            .then(({ data }) => setRows(data))
            .catch(error => alert(error));
    }

    const replaceEntity = (entity) => {
        let entityInRows = !!rows.filter(row => row.id === entity.id).length;
        entityInRows ? setRows(rows.map(row => row.id === entity.id ? entity : row)) : setRows([...rows, entity]);
    }

    const onEditClick = (item) => {
        setEditingEntity(item);
        setEditDialogOpen(true);
    }

    const onDeleteClick = (item) => {
        var confirmed = window.confirm('Вы действительно хотите удалить этот объект?');

        if (confirmed) {
            setRows(rows.filter(row => row.id !== item.id));
            if (item.status !== 'new') {
                axios.delete(`${serviceUrl}${item.id}/`)
                    .catch(error => alert(`При удалении маркера ${item.name} произошла ошибка: ${error}`));
            }
        }
    }

    const handleAccept = () => {
        axios({
            method: 'PUT',
            url: `${serviceUrl}${editingEntity.id}/`,
            data: editingEntity
        })
            .then(({ data }) => {
                replaceEntity(data);
                setEditDialogOpen(false);
            })
            .catch((error) => alert('Ошибка при выполнении операции: ' + error));
    }

    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        axios({
            method: 'GET',
            url: serviceUrl
        })
            .then(({ data }) => setRows(data))
            .catch(error => alert(error));

        return () => {
            if (createMarkerModeOn) {
                switchCreateMarkerMode();
            }
        }
    }, []);


    return (
        <Container>
            <h1>Маркеры: </h1>
            <Container style={{ display: 'flex', paddingRight: 0, justifyContent: 'end' }}>
                <Button variant='contained' color='primary' onClick={switchCreateMarkerMode}>Добавить</Button>
            </Container>
            <Table
                header={(
                    <><TableCell>Название</TableCell>
                        <TableCell align="center">Маршрут</TableCell>
                        <TableCell></TableCell></>
                )}
                rows={rows.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell scope="row">{row.name}</TableCell>
                        <TableCell align="right">{row.route ? row.route : ''}</TableCell>
                        <TableCell align="right">
                            <Button onClick={() => onEditClick(row)}><Edit color='action' /></Button>
                            <Button onClick={() => onDeleteClick(row)}><DeleteIcon color='secondary' /></Button>
                            <Menu markerId={row.id} />
                        </TableCell>
                    </TableRow>
                ))} />
            <Dialog title='Редактировать маркер'
                open={editDialogOpen}
                buttons={[
                    {
                        label: 'Закрыть',
                        action: () => setEditDialogOpen(false),
                    },
                    {
                        label: 'Сохранить',
                        action: handleAccept,
                        color: 'primary',
                        disabled: () => Object.values(validators).filter(valid => !valid(editingEntity)).length > 0
                    }
                ]}
            >
                <Input label='Название'
                    value={editingEntity.name}
                    name='name'
                    onChange={onChange}
                    validators={[
                        {
                            validate: () => validators.name(editingEntity),
                            message: 'Заполните название точки'
                        }
                    ]}
                />
            </Dialog>

            <Dialog title='Включен режим добавления маркера'
                open={createMarkerModeOn}
                buttons={[
                    {
                        label: 'Закончить добавление',
                        action: switchCreateMarkerMode,
                        color: 'primary'
                    }
                ]}>
                <DialogContentText>
                    Считайте маркер для добавления
                </DialogContentText>
            </Dialog>

        </Container>
    )
}
