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

import Notifications from '../notifications/Notifications';
import UserMenu from '../user_menu/UserMenu';

import * as genValidators from '../dialog/validators';

const validators = {
    username: ({username}) => !genValidators.isEmpty(username),
    password: ({password}) => !genValidators.isEmpty(password) && password.length > 5
}

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
                            <Button color='inherit'>Войти</Button>
                            :
                            <>
                                <Notifications />
                                <UserMenu />
                            </>
                    }

                    <Dialog title='Авторизация'
                        open={!props.isAuthenticated}
                        buttons={[
                            {
                                label: 'Войти',
                                action: authHandle,
                                color: 'primary',
                                disabled: () => Object.values(validators).filter(validate => !validate(credentials)).length > 0
                            }
                        ]}
                        maxWidth='400px'
                    >
                        <Input
                            label='Логин'
                            name='username'
                            onChange={handleCredentialsChange}
                            validators={[
                                {
                                    validate: () => props.authError === null,
                                    message: 'Логин или пароль не верен'
                                },
                                {
                                    validate: () => validators.username(credentials),
                                    message: 'Поле должно быть заполнено!'
                                }]
                            }
                        />
                        <PasswordInput
                            label='Пароль'
                            name='password'
                            onChange={handleCredentialsChange}
                            validators={[
                                {
                                    validate: () => props.authError === null,
                                    message: 'Логин или пароль не верен'
                                },
                                {
                                    validate: () => validators.password(credentials),
                                    message: 'Пароль должен сожержать не менее 6 символов!'
                                }]
                            }
                        />
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
