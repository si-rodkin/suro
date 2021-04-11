import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from '@material-ui/core';
import { Container } from '@material-ui/core';

import moment from 'moment';

import axios from 'axios';

import Table from '../../components/table/Table';

import * as enviroment from '../../enviroment';

const serviceUrl = `${enviroment.apiHost}/api/commits/`;

const getColor = row => {
    const actualCommitTime = moment(row.date, 'hh:mm:ss');
    const planningCommitTime = moment(row.round.start_time, 'hh:mm:ss');
    const allowanceTime = Number(row.round.time_allowance);
    const lateTime = Number(row.round.late_time);

    const diff = actualCommitTime.diff(planningCommitTime, 'minutes');

    if (diff <= allowanceTime) {
        return 'lightgreen';
    }

    if (diff <= lateTime) {
        return 'yellow';
    }

    return 'lightcoral';
}

export default function Statistics() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        axios({
            method: 'GET',
            url: serviceUrl
        })
            .then(({ data }) => setRows(data))
            .catch(error => console.log(error));
    }, []);

    return (
        <Container>
            <h1>Статистика обходов: </h1>
            <Table
                header={(<>
                    <TableCell>Дата и время обхода факт.</TableCell>
                    <TableCell>Заданные дата и время обхода</TableCell>
                    <TableCell>Номер метки</TableCell>
                    <TableCell>Имя устройства</TableCell></>
                )}
                rows={rows.map((row) => (
                    <TableRow key={row.name} style={{ backgroundColor: getColor(row) }}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.round.start_time}</TableCell>
                        <TableCell>{row.marker.name}</TableCell>
                        <TableCell>{row.device.name}</TableCell>
                    </TableRow>
                ))} />
        </Container>
    )
}
