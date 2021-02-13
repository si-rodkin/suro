import React from 'react'

import axios from 'axios';

import { connect } from 'react-redux';

import * as actions from '../../store/actions/auth';
import * as enviroment from '../../enviroment';

import Avatar from '@material-ui/core/Avatar';
import { Menu, MenuItem, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const linkStyle = {
    color: 'black',
    textDecoration: 'none'
}

function UserMenu(props) {
    const [anchor, setAnchor] = React.useState(undefined);

    // TODO: почитать про хук мемоизации в реакте
    const handleUnauthClick = () => {
        const confirmed = window.confirm('Хотите действительно хотите выйти?');

        if (confirmed)
            props.onUnauth();
    }

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
                <MenuItem><Link style={linkStyle} href='/user/profile'>Профиль</Link></MenuItem>
                <MenuItem><Link style={linkStyle} onClick={handleUnauthClick}>Выход</Link></MenuItem>
            </Menu>
        </div>
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
