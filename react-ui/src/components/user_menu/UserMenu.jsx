import React from 'react'

import { connect } from 'react-redux';

import * as actions from '../../store/actions/auth';

import Avatar from '@material-ui/core/Avatar';
import { Menu, MenuItem, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import UserProfile from '../../pages/users/profile/UserProfile';
import ChangePassword from '../../pages/users/password/ChangePassword';

const linkStyle = {
    color: 'black',
    textDecoration: 'none'
}

function UserMenu(props) {
    const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);
    const [anchor, setAnchor] = React.useState(undefined);

    // TODO: почитать про хук мемоизации в реакте
    const handleUnauthClick = () => {
        const confirmed = window.confirm('Хотите действительно хотите выйти?');

        if (confirmed)
            props.onUnauth();
    }

    const handleProfileOpen = () => setProfileOpen(true);
    const handleChangePassOpen = () => setChangePasswordOpen(true);

    return (
        <div style={{ marginRight: '15px' }}>
            <Avatar onClick={e => setAnchor(e.currentTarget)} src="..." />
            <Menu keepMounted
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(undefined)}
            >
                <MenuItem onClick={handleProfileOpen}><Link style={linkStyle}>Профиль</Link></MenuItem>
                <MenuItem onClick={handleChangePassOpen}><Link style={linkStyle}>Изменить пароль</Link></MenuItem>
                {/* <MenuItem><Link style={linkStyle}>Параметры организации</Link></MenuItem>
                <MenuItem><Link style={linkStyle}>Параметры безопасности</Link></MenuItem> */}
                <MenuItem onClick={handleUnauthClick}><Link style={linkStyle}>Выход</Link></MenuItem>
            </Menu>

            <UserProfile
                open={profileOpen}
                close={() => setProfileOpen(false)}
            />
            <ChangePassword
                open={changePasswordOpen}
                close={() => setChangePasswordOpen(false)}
                userId={props.userId}
            />
        </div >
    )
}

const mapStateToProps = state => {
    return {
        userId: state.user?.id
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUnauth: () => {
            dispatch(actions.logout());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)
