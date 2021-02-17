import React from 'react'

import axios from 'axios';

import { connect } from 'react-redux';

import * as actions from '../../store/actions/auth';
import * as enviroment from '../../enviroment';

import Avatar from '@material-ui/core/Avatar';
import { Menu, MenuItem, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import UserProfile from '../../pages/users/profile/UserProfile';

const linkStyle = {
    color: 'black',
    textDecoration: 'none'
}

function UserMenu(props) {
    const [profileOpen, setProfileOpen] = React.useState(false);
    const [anchor, setAnchor] = React.useState(undefined);

    // TODO: почитать про хук мемоизации в реакте
    const handleUnauthClick = () => {
        const confirmed = window.confirm('Хотите действительно хотите выйти?');

        if (confirmed)
            props.onUnauth();
    }

    const handleProfileOpen = () => setProfileOpen(true);

    React.useEffect(() => {
        axios.get(`${enviroment.apiHost}/api/user/`, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        })
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }, [])
    return (
        <div style={{ marginRight: '15px' }}>
            <Avatar onClick={e => setAnchor(e.currentTarget)} src="..." />
            <Menu keepMounted
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(undefined)}
            >
                <MenuItem onClick={handleProfileOpen}><Link style={linkStyle}>Профиль</Link></MenuItem>
                <MenuItem><Link style={linkStyle}>Параметры организации</Link></MenuItem>
                <MenuItem><Link style={linkStyle}>Параметры безопасности</Link></MenuItem>
                <MenuItem onClick={handleUnauthClick}><Link style={linkStyle}>Выход</Link></MenuItem>
            </Menu>

            <UserProfile
                open={profileOpen}
                close={() => setProfileOpen(false)}
            />
        </div >
    )
}

const mapDispatchToProps = dispatch => {
    return {
        onUnauth: () => {
            dispatch(actions.logout());
        }
    }
}

export default connect(undefined, mapDispatchToProps)(UserMenu)
