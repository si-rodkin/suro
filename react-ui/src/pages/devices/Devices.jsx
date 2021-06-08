import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { Container, Button } from "@material-ui/core";

import Edit from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import axios from "axios";
import ld from "lodash";

import Table from "../../components/table/Table";
import DevicesForm from "./DevicesForm";

import {default as withCrud} from '../../hocs/WithCRUD';
import * as enviroment from "../../enviroment";

const serviceUrl = `${enviroment.apiHost}/api/devices/`;

function Devices({ data, read, create, update, remove }) {
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingEntity, setEditingEntity] = React.useState({});
  const [guardRoutes, setGuardRoutes] = React.useState([]);

  const onEdit = (item) => {
    setEditingEntity(item);
    axios
      .get(`${enviroment.apiHost}/api/guard-routes/`)
      .then((response) => setGuardRoutes(response.data))
      .catch((error) =>
        alert(`Ошибка при загрузке списка охраняемых маршрутов: ${error}`)
      );
    setEditDialogOpen(true);
  };
  const onDelete = (item) => remove(`${serviceUrl}${item.id}/`, item);
  React.useEffect(() => read(serviceUrl), []);

  return (
    <Container>
      <h1>Устройства</h1>
      <Container
        style={{ display: "flex", paddingRight: 0, justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => onEdit({ id: null, guard_routes: [] })}
        >
          Добавить
        </Button>
      </Container>
      <Table
        header={
          <>
            <TableCell>Название</TableCell>
            <TableCell align="center">IMEI</TableCell>
            <TableCell align="center">Телефон</TableCell>
            <TableCell></TableCell>
          </>
        }
        rows={data.map((row) => (
          <TableRow key={row.name}>
            <TableCell scope="row">{row.name}</TableCell>
            <TableCell align="center">{row.imei}</TableCell>
            <TableCell align="center">{row.phone}</TableCell>
            <TableCell align="right">
              <Button onClick={() => onEdit(row)}>
                <Edit color="action" />
              </Button>
              <Button onClick={() => onDelete(row)}>
                <DeleteIcon color="secondary" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      />
      <DevicesForm
        guardRoutes={guardRoutes}
        open={editDialogOpen}
        value={() => ld.cloneDeep(editingEntity)}
        create={create}
        update={update}
        close={() => setEditDialogOpen(false)}
      />
    </Container>
  );
}

export default withCrud(Devices);


