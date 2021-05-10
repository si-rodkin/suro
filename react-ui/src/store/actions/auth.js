import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as enviroment from '../../enviroment';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const authSuccess = (token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
}

export const setUser = (user) => {
    return {
        type: actionTypes.SET_USER,
        user
    }
}

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

const checkAuthTimeOut = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
}

export const authLogin = (login, password) => {
    
    const EXPIRATION_TIME = 3600;

    return dispatch => {
        authStart();
        axios.post(`${enviroment.apiHost}/api/rest-auth/login/`, {username: login, password: password})
            .then(res => {
                const token = res.data.key;
                const expirationDate = new Date(new Date().getTime() + EXPIRATION_TIME * 1000);
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token));
                checkAuthTimeOut(EXPIRATION_TIME);

                axios.get(`${enviroment.apiHost}/api/user/`, {
                    headers: {
                        authorization: token
                    }
                })
                .then(response => {
                    localStorage.setItem('user', JSON.stringify(response.data))
                    dispatch(setUser(response.data));
                })
                .catch(error => console.log(error));        
            })
            .catch(err => {
                dispatch(authFail(err));
            });
    }
}


export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token));
                dispatch(setUser(JSON.parse(localStorage.getItem('user'))))
                dispatch(checkAuthTimeOut((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    }
}
