import React from "react";
import { connect } from 'react-redux';
import { TableCell, TableRow } from '@material-ui/core';
import { Container, Button } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import ld from 'lodash';
import Table from "../../components/table/Table";
import EmployeeForm from "./EmployeeForm";
import Menu from './Menu';
import * as enviroment from '../../enviroment';

const serviceUrl = `${enviroment.apiHost}/api/users/`;

function Employees({uid, ...props}) {
    window.props = props;
    const id = props.match.params.uid? props.match.params.uid : uid;
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingEntity, setEditingEntity] = React.useState({});

    const replaceEntity = (entity) => {
        let entityInRows = !!rows.filter(row => row.id === entity.id).length;
        entityInRows ? setRows(rows.map(row => row.id === entity.id ? entity : row)) : setRows([...rows, entity]);
    };

    const onEditClick = (item) => {
        setEditingEntity(item);
        setEditDialogOpen(true);
    };

    const onDeleteClick = (item) => {
        var confirmed = window.confirm('Вы действительно хотите удалить этот элемент?');

        if (confirmed) {
            setRows(rows.filter(row => row.id !== item.id));
            if (item.status !== 'new') {
                axios.delete(`${serviceUrl}${item.id}/`)
                    .catch(error => alert(`При удалении пользователя ${item.name} произошла ошибка: ${error}`));
            }
        }
    };

    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        axios({
            method: 'GET',
            url: `${serviceUrl}?uid=${id}`
        })
            .then(({ data }) => setRows(data))
            .catch(error => alert(`Ошибка при загрузке списка пользователей: ${error}`));
    }, [id]);

    return (
        <Container>
            <h1>Сотрудники</h1>
            <Container style={{ display: 'flex', paddingRight: 0, justifyContent: 'flex-end' }}>
                <Button variant='contained' color='primary' onClick={() => onEditClick({ id: null, guard_routes: [] })}>Добавить</Button>
            </Container>
            <Table
                header={(
                    <>
                        <TableCell>Табельный номер</TableCell>
                        <TableCell align="center">Фамилия</TableCell>
                        <TableCell align="center">Имя</TableCell>
                        <TableCell align="center">Должность</TableCell>
                        <TableCell />
                    </>
                )}
                rows={rows?.map((row) => (
                    <TableRow key={row.personnel_number}>
                        <TableCell scope="row">{row.personnel_number}</TableCell>
                        <TableCell align="center">{row.first_name}</TableCell>
                        <TableCell align="center">{row.last_name}</TableCell>
                        <TableCell align="center">{row.position}</TableCell>
                        <TableCell align="right">
                            <Button onClick={() => onEditClick(row)}><Edit color='action' /></Button>
                            <Button onClick={() => onDeleteClick(row)}><DeleteIcon color='secondary' /></Button>
                            <Menu employee={row} />
                        </TableCell>
                    </TableRow>
                ))} />
            <EmployeeForm open={editDialogOpen}
                value={() => ld.cloneDeep(editingEntity)}
                close={() => setEditDialogOpen(false)}
                saveHandler={replaceEntity} />
        </Container>
    );
}

const mapStateToProps = (state) => {
    return {
        uid: state.user?.id
    }
}

export default connect(mapStateToProps, null)(Employees)

