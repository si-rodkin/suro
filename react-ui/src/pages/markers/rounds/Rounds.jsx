import React from "react";
import { TableCell, TableRow } from '@material-ui/core';
import { Container, Button } from '@material-ui/core';

import Table from "../../../components/table/Table";
import RoundsForm from './RoundsForm';

import Edit from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import axios from 'axios';
import ld from 'lodash';

import * as enviroment from '../../../enviroment';

export default function Rounds(props) {
    var serviceUrl = `${enviroment.apiHost}/api/markers/<markerId>/rounds/`;
    serviceUrl = serviceUrl.replace('<markerId>', `${props.match.params.markerId}`);

    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingEntity, setEditingEntity] = React.useState({});
    const [devices, setDevices] = React.useState([])

    const replaceEntity = (entity) => {
        let entityInRows = !!rows.filter(row => row.id === entity.id).length;
        entityInRows ? setRows(rows.map(row => row.id === entity.id ? entity : row)) : setRows([...rows, entity]);
    }

    const onEditClick = (item) => {
        setEditingEntity(item);
        setEditDialogOpen(true);
    }

    const onDeleteClick = (item) => {
        if (window.confirm('Вы действительно хотите удалить этот элемент?')) {
            setRows(rows.filter(row => row.id !== item.id));
            if (item.status !== 'new') {
                axios.delete(`${enviroment.apiHost}/api/rounds/${item.id}/`)
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
            .catch(error => alert(`Ошибка при загрузке списка обходов: ${error}`));

        axios({
            method: 'GET',
            url: `${enviroment.apiHost}/api/devices/`
        })
            .then(({ data }) => setDevices(data))
            .catch(error => alert(`Ошибка при загрузке списка устройств: ${error}`));
    }, []);

    return (
        <Container>
            <h1>Обходы: </h1>
            <Container style={{ display: 'flex', paddingRight: 0, justifyContent: 'end' }}>
                <Button variant='contained' color='primary' onClick={() => onEditClick({ id: null, marker: props.match.params.markerId })}>Добавить</Button>
            </Container>
            <Table
                header={(<>
                    <TableCell>Название</TableCell>
                    <TableCell align="center">Дни обхода</TableCell>
                    <TableCell align="center">Начало обхода</TableCell>
                    <TableCell align="center">Конец обхода</TableCell>
                    <TableCell align="center">Время допуска</TableCell>
                    <TableCell align="center">Время опоздания</TableCell>
                    <TableCell></TableCell></>)}
                rows={rows.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell scope="row">{row.name}</TableCell>
                        <TableCell align="center">{row.days}</TableCell>
                        <TableCell align="center">{row.start_time}</TableCell>
                        <TableCell align="center">{row.end_time}</TableCell>
                        <TableCell align="center">{row.time_allowance}</TableCell>
                        <TableCell align="center">{row.late_time}</TableCell>
                        <TableCell align="right">
                            <Button onClick={() => onEditClick(row)}><Edit /></Button>
                            <Button onClick={() => onDeleteClick(row)}><DeleteIcon /></Button>
                        </TableCell>
                    </TableRow>
                ))} />
            <RoundsForm
                value={() => ld.cloneDeep(editingEntity)}
                close={() => setEditDialogOpen(false)}
                open={editDialogOpen}
                saveHandler={replaceEntity}
                devices={devices} />
        </Container>
    )
}
