import React from 'react'

import {Button, Menu, MenuItem} from '@material-ui/core';

import {
    Link
} from 'react-router-dom';

import ListIcon from '@material-ui/icons/ListRounded';

function MarkerMenu({markerId}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    return (
        <>
            <Button onClick={(e) => setAnchorEl(e.currentTarget)}><ListIcon /></Button>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem>
                    <Link className='App-link' to={`/markers/${markerId}/rounds`} onClick={() => setAnchorEl(null)}>Обходы</Link>
                </MenuItem>
            </Menu>
        </>
    )
}

export default MarkerMenu;
