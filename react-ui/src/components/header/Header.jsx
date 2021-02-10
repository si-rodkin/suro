import React from 'react';

import {
    Link
} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Button, Typography, Menu, MenuItem, Container } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { connect } from 'react-redux';

import * as actions from '../../store/actions/auth';

import Dialog from '../dialog/Dialog';
import Input from '../dialog/controls/Input';
import PasswordInput from '../dialog/controls/PasswordInput';

// import logo from './logo.svg';
import './Header.css';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    }
}));

function Header(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [authDialogOpen, setAuthDialogOpen] = React.useState(false);
    const [credentials, updateCredentials] = React.useState({ username: undefined, password: undefined });

    const handleCredentialsChange = (name, value) => updateCredentials({ ...credentials, [name]: value });

    const handleMenuIconClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const authHandle = () => {
        props.onAuth(credentials.username, credentials.password);
    }

    return (
        <AppBar position='static'>
            <Container>
                <Toolbar>
                    <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
                        <MenuIcon onClick={handleMenuIconClick} />
                    </IconButton>
                    {props.isAuthenticated && (<>
                        <Menu
                            id='simple-menu'
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem><Link className='App-link' to='/objects' onClick={handleClose}>Объекты</Link></MenuItem>
                            <MenuItem><Link className='App-link' to='/devices' onClick={handleClose}>Устройства</Link></MenuItem>
                            <MenuItem><Link className='App-link' to='/markers' onClick={handleClose}>Маркеры</Link></MenuItem>
                            {/* <MenuItem><Link className="App-link" to="/users" onClick={handleClose}>Пользователи</Link></MenuItem> */}
                            <MenuItem><Link className='App-link' to='/statistics' onClick={handleClose}>Статистика</Link></MenuItem>
                        </Menu>
                    </>)}
                    <Typography variant='h6' className={classes.title}>
                        {props.title}
                    </Typography>

                    {
                        !props.isAuthenticated ?
                            <Button color='inherit' onClick={() => setAuthDialogOpen(true)}>Войти</Button>
                            :
                            // TODO: Аватар польщователя
                            <Button color='inherit' onClick={() => props.onUnauth()}>Выйти</Button>
                    }

                    <Dialog title='Авторизация'
                        open={authDialogOpen && !props.isAuthenticated}
                        close={() => setAuthDialogOpen(false)}
                        accept={authHandle}
                        acceptLabel='Войти'
                        maxWidth='400px'
                    >
                        <Input
                            label='Логин'
                            name='username'
                            onChange={handleCredentialsChange}
                            isValid={props.authError === null}
                            errorText='Логин или пароль не верен' />
                        <PasswordInput
                            label='Пароль'
                            name='password'
                            onChange={handleCredentialsChange}
                            isValid={props.authError === null}
                            errorText='Логин или пароль не верен' />
                    </Dialog>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

Header.defaultProps = {
    title: 'СУРО',
    isAuthenticated: false
}


const mapStateToProps = (state) => {
    window.state = state;
    return {
        isAuthenticated: state.token !== null,
        authError: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) => {
            dispatch(actions.authLogin(username, password));
        },
        onUnauth: () => {
            dispatch(actions.logout());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
