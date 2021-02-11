import React from "react";
import { TableCell, TableRow } from '@material-ui/core';
import { Container, Button } from '@material-ui/core';

import Edit from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import Table from "../../../components/table/Table";
import RoutesForm from './RoutesForm';

import * as enviroment from '../../../enviroment';

import axios from 'axios';
import ld from 'lodash';

export default function Routes(props) {
    var serviceUrl = `${enviroment.apiHost}/api/guarded-objects/<objectId>/guard-routes/`;
    serviceUrl = serviceUrl.replace('<objectId>', `${props.match.params.objectId}`);

    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingEntity, setEditingEntity] = React.useState({});
    const [markers, setMarkers] = React.useState([])

    const replaceEntity = (entity) => {
        let entityInRows = !!rows.filter(row => row.id === entity.id).length;
        entityInRows ? setRows(rows.map(row => row.id === entity.id ? entity : row)) : setRows([...rows, entity]);
    }

    const onEditClick = (item) => {
        setEditingEntity(item);
        axios({
            method: 'GET',
            url: `${enviroment.apiHost}/api/markers/free-or/${item.id ? item.id : -1}`
        })
            .then(({ data }) => setMarkers(data))
            .catch(error => alert(error));
        setEditDialogOpen(true);
    }

    const onDeleteClick = (item) => {
        var confirmed = window.confirm('Вы действительно хотите удалить этот элемент?');

        if (confirmed) {
            setRows(rows.filter(row => row.id !== item.id));
            if (item.status !== 'new') {
                axios.delete(`${enviroment.apiHost}/api/guard-routes/${item.id}/`)
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
            .catch(error => alert(error));
    }, []);

    return (
        <Container>
            <h1>Маршруты: </h1>
            <Container style={{ display: 'flex', paddingRight: 0, justifyContent: 'end' }}>
                <Button variant='contained' color='primary' onClick={() => onEditClick({ id: null, name: '', markers: [] })}>Добавить</Button>
            </Container>
            <Table
                header={(<><TableCell>Наименование</TableCell>
                    <TableCell></TableCell></>)}
                rows={rows.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell scope="row">{row.name}</TableCell>
                        <TableCell align="right">
                            <Button onClick={() => onEditClick(row)}><Edit /></Button>
                            <Button onClick={() => onDeleteClick(row)}><DeleteIcon /></Button>
                        </TableCell>
                    </TableRow>
                ))} />
            <RoutesForm markers={markers}
                objectId={props.match.params.objectId}
                open={editDialogOpen}
                value={() => ld.cloneDeep(editingEntity)}
                close={() => setEditDialogOpen(false)}
                saveHandler={replaceEntity} />
        </Container>
    )
}
