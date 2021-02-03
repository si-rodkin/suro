import React from 'react'

import { Table as MuiTable, TableBody, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

export default function Table({ header, rows }) {
    return (
        <TableContainer component={Paper}>
            <MuiTable aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {header}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </MuiTable>
        </TableContainer>
    )
}
