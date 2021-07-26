import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER
} from './types';

export function loginUser(dataToSubmit) {
    
    const request = axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data) // 서버에서 받은 데이터를 request에 저장

    return { // request를 Reducer에 넘겨주는 작업, 이전의 값과 action으로 새로운 값을 생성
        type: LOGIN_USER,
        payload: request
    } // action 객체는 type과 response 필요
}

export function registerUser(dataToSubmit) {
    
    const request = axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data) // 서버에서 받은 데이터를 request에 저장

    return { // request를 Reducer에 넘겨주는 작업, 이전의 값과 action으로 새로운 값을 생성
        type: REGISTER_USER,
        payload: request
    } // action 객체는 type과 response 필요
}