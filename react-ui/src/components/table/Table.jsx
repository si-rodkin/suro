import React from 'react'

import { Table as MuiTable, TableBody, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';

export default function Table({ header, rows }) {
    const [page, setPage] = React.useState(0);
    const [rowPerPage, setRowPerPage] = React.useState(5)

    const handleChangePage = (_, page) => {
        setPage(page);
    }

    const handleChangeRowsPerPage = event => {
        setRowPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    return (
        <TableContainer component={Paper}>
            <MuiTable aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {header}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.slice(page * rowPerPage, page * rowPerPage + rowPerPage)}
                </TableBody>
            </MuiTable>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </TableContainer>
    )
}
