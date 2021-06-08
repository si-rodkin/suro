import React from "react";

import axios from 'axios';

function withCrud(Component) {
  return function (props) {
    const [data, setData] = React.useState([]);

    const replaceEntity = (entity) => {
      let entityInRows = !!data.filter((row) => row.id === entity.id).length;
      entityInRows
        ? setData(data.map((row) => (row.id === entity.id ? entity : row)))
        : setData([...data, entity]);
    };

    const create = (url, entity) => {
      axios({
        method: "POST",
        url: url,
        data: entity,
      })
        .then(({ data }) => {
          replaceEntity(data);
        })
        .catch((error) => alert("Ошибка при выполнении операции: " + error));
    };

    const read = (url) => {
      axios({
        method: "GET",
        url: url,
      })
        .then(({ data }) => setData(data))
        .catch((error) =>
          alert(`Ошибка при загрузке списка устройств: ${error}`)
        );
    };

    const update = (url, entity) => {
      axios({
        method: "PUT",
        url: url,
        data: entity,
      })
        .then(({ data }) => {
          replaceEntity(data);
        })
        .catch((error) => alert("Ошибка при выполнении операции: " + error));
    };

    const remove = (url, removingItem) => {
      var confirmed = window.confirm(
        "Вы действительно хотите удалить этот элемент?"
      );

      if (confirmed) {
        setData(data.filter((item) => item.id !== removingItem.id));
        if (removingItem.status !== "new") {
          axios
            .delete(url)
            .catch((error) =>
              alert(
                `При удалении элемента ${removingItem.name} произошла ошибка: ${error}`
              )
            );
        }
      }
    };

    return (
      <Component {...props}
        create={create}
        read={read}
        update={update}
        remove={remove}
        data={data}
      />
    );
  };
}

export default withCrud;
