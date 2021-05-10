import React from 'react'

import {Button, Menu, MenuItem} from '@material-ui/core';

import {
    Link
} from 'react-router-dom';

import ListIcon from '@material-ui/icons/ListRounded';
import ChangePassword from '../users/password/ChangePassword';

function MarkerMenu({employee}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);

    const ChangePassowordClickHandle = () => {
        setAnchorEl(null);
        setChangePasswordOpen(true);
    }

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
                    <Link className='App-link' onClick={ChangePassowordClickHandle}>Изменить пароль</Link>
                </MenuItem>
                {employee.is_leading &&
                <MenuItem>
                    <Link className='App-link' to={`/employee/${employee.id}/employees`} onClick={() => setAnchorEl(null)}>Подчиненные</Link>
                </MenuItem>
                }
            </Menu>
            <ChangePassword
                open={changePasswordOpen}
                close={() => setChangePasswordOpen(false)}
                userId={employee.id}
            />
        </>
    )
}

export default MarkerMenu;
