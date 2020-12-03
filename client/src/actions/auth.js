import axios from 'axios';
import { setAlert } from './alert'
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';

//load user
export const loadUser = () => async dispatch => {   //check if there is token inside the localstorage which we are using to store the token that is randmoly genereated 
    if (localStorage.token) {
        setAuthToken(localStorage.token);      // so header mai dall diya x-auth-token mai bole toh header mai
    }
    try {
        const res = await axios.get('/api/auth');     // yha se token nikala
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })



    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

//Register User
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('api/users', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: REGISTER_FAIL
        });
    }
}

//Login User
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: LOGIN_FAIL
        });
    }
}

//for logout/cleare the profile

export const logout = () => dispatch =>{
    dispatch({ type: LOGOUT});
}