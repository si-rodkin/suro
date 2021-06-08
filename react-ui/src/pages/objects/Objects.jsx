import React from "react";
import { TableCell, TableRow } from '@material-ui/core';
import { Container, Button } from '@material-ui/core';

import Edit from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import ld from 'lodash';

import Table from "../../components/table/Table";
import ObjectMenu from './Menu';
import ObjectForm from "./ObjectForm";

import {default as withCrud} from '../../hocs/WithCRUD';
import * as enviroment from '../../enviroment';

const serviceUrl = `${enviroment.apiHost}/api/guarded-objects/`;

function Objects({data, create, update, read, remove}) {
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editingEntity, setEditingEntity] = React.useState({});

    const onEdit = (item) => {
      setEditingEntity(item);
      setEditDialogOpen(true);
    };
    const onDelete = (item) => remove(`${serviceUrl}${item.id}/`, item);
    React.useEffect(() => read(serviceUrl), []);
    
    return (
        <Container>
            <h1>Объекты</h1>
            <Container style={{ display: 'flex', paddingRight: 0, justifyContent: 'flex-end' }}>
                <Button variant='contained'
                        color='primary'
                        onClick={() => onEdit({id: null, name: '', itn: ''})}>Добавить</Button>
            </Container>

            <Table
                header={(<><TableCell>Название</TableCell>
                    <TableCell align="center">ИНН</TableCell>
                    <TableCell></TableCell></>)}
                rows={data.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell scope="row">{row.name}</TableCell>
                        <TableCell align="center">{row.itn}</TableCell>
                        <TableCell align="right">
                            <Button onClick={() => onEdit(row)}><Edit color='action' /></Button>
                            <Button onClick={() => onDelete(row)}><DeleteIcon color='secondary' /></Button>
                            <ObjectMenu objectId={row.id} />
                        </TableCell>
                    </TableRow>
                ))} />
            <ObjectForm open={editDialogOpen}
                        value={() => ld.cloneDeep(editingEntity)}
                        close={() => setEditDialogOpen(false)}
                        create={create}
                        update={update} />
        </Container>
    )
}

export default withCrud(Objects);
