import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { Container, Button } from "@material-ui/core";

import Edit from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import Table from "../../../components/table/Table";
import RoutesForm from "./RoutesForm";
import RouteMenu from "./Menu";

import * as enviroment from "../../../enviroment";

import axios from "axios";
import ld from "lodash";
import withCrud from "../../../hocs/WithCRUD";

function Routes({data, create, read, update, remove, ...props}) {
  var serviceUrl = `${enviroment.apiHost}/api/guarded-objects/<objectId>/guard-routes/`;
    serviceUrl = serviceUrl.replace('<objectId>', `${props.match.params.objectId}`);

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingEntity, setEditingEntity] = React.useState({});
  const [markers, setMarkers] = React.useState([]);

  const onEdit = (item) => {
    setEditingEntity(item);
    axios({
      method: "GET",
      url: `${enviroment.apiHost}/api/markers/free-or/${
        item.id ? item.id : -1
      }`,
    })
      .then(({ data }) => setMarkers(data))
      .catch((error) => alert(error));
    setEditDialogOpen(true);
  };
  const onDelete = (item) => remove(`${enviroment.apiHost}/api/guard-routes/${item.id}/`, item);
  React.useEffect(() => read(serviceUrl), []);

  return (
    <Container>
      <h1>Маршруты</h1>
      <Container
        style={{ display: "flex", paddingRight: 0, justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => onEdit({ id: null, name: "", markers: [] })}
        >
          Добавить
        </Button>
      </Container>
      <Table
        header={
          <>
            <TableCell>Наименование</TableCell>
            <TableCell></TableCell>
          </>
        }
        rows={data.map((row) => (
          <TableRow key={row.name}>
            <TableCell scope="row">{row.name}</TableCell>
            <TableCell align="right">
              <Button onClick={() => onEdit(row)}>
                <Edit color="action" />
              </Button>
              <Button onClick={() => onDelete(row)}>
                <DeleteIcon color="secondary" />
              </Button>
              <RouteMenu routeId={row.id} />
            </TableCell>
          </TableRow>
        ))}
      />
      <RoutesForm
        markers={markers}
        objectId={props.match.params.objectId}
        open={editDialogOpen}
        value={() => ld.cloneDeep(editingEntity)}
        close={() => setEditDialogOpen(false)}
        create={create}
        update={update}
      />
    </Container>
  );
}


export default withCrud(Routes);
