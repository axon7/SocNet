import {GET_ERRORS, SET_CURRENT_USER} from './types';
import setAuthToken from '../utils/setAuthToken';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
export const registerUser = (userData, history) => dispatch=>{
    axios //axios is for request and responses
    .post("/api/users/register", userData)
    .then(res=> history.push('/login'))
    .catch(err=> dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    }))
    
}    

export const loginUser = userData => dispatch=>{
    axios
        .post("/api/users/login", userData)
        .then(res => {
            //save in localstorage 
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);
            //set token to local storage
            setAuthToken(token);

            //decode token to get user data
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded)); 

        })
        .catch(err=> dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }) )
}


export const setCurrentUser = (decoded) =>{
    return {
           type: SET_CURRENT_USER,
           payload: decoded
    }
}


export const logoutUser = () => dispatch =>{
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}))

}