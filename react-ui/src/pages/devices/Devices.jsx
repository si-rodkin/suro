import React from "react";
import { TableCell, TableRow } from '@material-ui/core';
import { Container, Button } from '@material-ui/core';

import Edit from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import axios from 'axios';
import ld from 'lodash';

import Table from "../../components/table/Table";
import DevicesForm from "./DevicesForm";

const serviceUrl = 'http://localhost:8000/api/devices/';

export default function Devices() {
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingEntity, setEditingEntity] = React.useState({});
    const [guardRoutes, setGuardRoutes] = React.useState([]);

    const replaceEntity = (entity) => {
        let entityInRows = !!rows.filter(row => row.id === entity.id).length;
        entityInRows ? setRows(rows.map(row => row.id === entity.id ? entity : row)) : setRows([...rows, entity]);
    }

    const onEditClick = (item) => {
        setEditingEntity(item);

        axios.get('http://localhost:8000/api/guard-routes/')
            .then(response => setGuardRoutes(response.data))
            .catch(error => alert(`Ошибка при загрузке списка охраняемых маршрутов: ${error}`));

        setEditDialogOpen(true);
    }

    const onDeleteClick = (item) => {
        var confirmed = window.confirm('Вы действительно хотите удалить этот элемент?');

        if (confirmed) {
            setRows(rows.filter(row => row.id !== item.id));
            if (item.status !== 'new') {
                axios.delete(`${serviceUrl}${item.id}`)
                    .catch(error => alert(`При удалении устройства ${item.name} произошла ошибка: ${error}`));
            }
        }
    }

    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        axios({
            method: 'GET',
            url: serviceUrl
        })
            .then(({ data }) => setRows(data))
            .catch(error => alert(`Ошибка при загрузке списка устройств: ${error}`));
    }, []);

    return (
        <Container>
            <h1>Устройства: </h1>
            <Container style={{ display: 'flex', paddingRight: 0, justifyContent: 'end' }}>
                <Button variant='contained' color='primary' onClick={() => onEditClick({ id: null, guard_routes: [] })}>Добавить</Button>
            </Container>
            <Table
                header={(<>
                    <TableCell>Название</TableCell>
                    <TableCell align="center">IMEI</TableCell>
                    <TableCell align="center">Телефон</TableCell>
                    <TableCell></TableCell></>
                )}
                rows={rows.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell scope="row">{row.name}</TableCell>
                        <TableCell align="center">{row.imei}</TableCell>
                        <TableCell align="center">{row.phone}</TableCell>
                        <TableCell align="right">
                            <Button onClick={() => onEditClick(row)}><Edit /></Button>
                            <Button onClick={() => onDeleteClick(row)}><DeleteIcon /></Button>
                        </TableCell>
                    </TableRow>
                ))} />
            <DevicesForm guardRoutes={guardRoutes}
                open={editDialogOpen}
                value={() => ld.cloneDeep(editingEntity)}
                close={() => setEditDialogOpen(false)}
                saveHandler={replaceEntity} />
        </Container>
    )
}
