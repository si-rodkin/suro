import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from '@material-ui/core';
import { Container } from '@material-ui/core';

import moment from 'moment';

import axios from 'axios';

import Table from '../../components/table/Table';

import * as enviroment from '../../enviroment';

const serviceUrl = `${enviroment.apiHost}/api/commits/`;

const getColor = row => {
    const actualCommitTime = moment(row.date);
    const planningCommitTime = moment(`${actualCommitTime.format('yyyy-MM-DDT')}${row.round.start_time}`);
    const allowanceTime = Number(row.round.time_allowance);
    const lateTime = Number(row.round.late_time);

    const diff = Math.abs(actualCommitTime.diff(planningCommitTime, 'minutes'));

    if (row.date === null) {
        return 'whitesmock';
    }

    if (diff <= allowanceTime) {
        return 'lightgreen';
    }

    if (diff <= lateTime) {
        return 'yellow';
    }

    return 'lightcoral';
}

export default function Statistics() {
    const [plannedCommits, setPlannedCommits] = useState([]);
    const [unPlannedCommits, setUnPlannedCommits] = useState([]);

    useEffect(() => {
        axios({
            method: 'GET',
            url: `${serviceUrl}planned/`
        })
        .then(({ data }) => setPlannedCommits(data))
        .catch(error => console.log(error));

        axios({
            method: 'GET',
            url: `${serviceUrl}unplanned/`
        })
        .then(({ data }) => setUnPlannedCommits(data))
        .catch(error => console.log(error));
    }, []);

    return (
        <Container>
            <h1>Статистика обходов</h1>
            <h3 style={{marginTop: '2.5%'}}>Запланированные</h3>
            <Table
                header={(<>
                    <TableCell>Дата обхода</TableCell>
                    <TableCell>Время обхода факт.</TableCell>
                    <TableCell>Заданное время обхода</TableCell>
                    <TableCell>Номер метки</TableCell>
                    <TableCell>Имя устройства</TableCell></>
                )}
                rows={plannedCommits?.map((row) => (
                    <TableRow key={row.name} style={{ backgroundColor: getColor(row) }}>
                        <TableCell>{row.date !== null? moment(row.date).format("DD-MM-yy"): ''}</TableCell>
                        <TableCell>{row.date !== null? moment(row.date).format("HH:mm:ss"): 'Точка не отмечена'}</TableCell>
                        <TableCell>{row.round.start_time}</TableCell>
                        <TableCell>{row.marker.name}</TableCell>
                        <TableCell>{row.device.name}</TableCell>
                    </TableRow>
                ))} />
            <h3 style={{marginTop: '2.5%'}}>Случайные</h3>
            <Table
                header={(<>
                    <TableCell>Дата обхода</TableCell>
                    <TableCell>Время обхода</TableCell>
                    <TableCell>Номер метки</TableCell>
                    <TableCell>Имя устройства</TableCell></>
                )}
                rows={unPlannedCommits?.map((row) => (
                    <TableRow key={row.name}>
                        <TableCell>{moment(row.date).format("DD-MM-yy")}</TableCell>
                        <TableCell>{moment(row.date).format("HH:mm:ss")}</TableCell>
                        <TableCell>{row.marker.name}</TableCell>
                        <TableCell>{row.device.name}</TableCell>
                    </TableRow>
                ))} />
        </Container>
    )
}
