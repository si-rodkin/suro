import React from "react";
import { Button, Container } from '@material-ui/core';
import { TableCell, TableRow } from '@material-ui/core';

import Table from "../../components/table/Table";
import Dialog from '../../components/dialog/Dialog';
import Input from '../../components/dialog/controls/Input';
import Menu from './Menu';

import Edit from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import axios from 'axios';

import * as enviroment from '../../enviroment';

const serviceUrl = `${enviroment.apiHost}/api/markers/`;

export default function Markers() {
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingEntity, setEditingEntity] = React.useState({});

    const onChange = (name, value) => setEditingEntity({ ...editingEntity, [name]: value });

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
                axios.delete(`${serviceUrl}${item.id}`)
                    .catch(error => alert(`При удалении маркера ${item.name} произошла ошибка: ${error}`));
            }
        }
    }

    const handleAccept = () => {
        axios({
            method: 'PUT',
            url: `${serviceUrl}${editingEntity.id}`,
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
    }, []);

    return (
        <Container>
            <h1>Маркеры: </h1>
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
                            <Button onClick={() => onEditClick(row)}><Edit /></Button>
                            <Button onClick={() => onDeleteClick(row)}><DeleteIcon /></Button>
                            <Menu markerId={row.id} />
                        </TableCell>
                    </TableRow>
                ))} />
            <Dialog title='Редактировать маркер'
                open={editDialogOpen}
                close={() => setEditDialogOpen(false)}
                accept={handleAccept}>
                <Input label='Название' value={editingEntity.name} onChange={onChange} />
            </Dialog>
        </Container>
    )
}
