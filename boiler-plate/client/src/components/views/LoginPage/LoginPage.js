import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action'

function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        // 버튼을 누르게 되면 페이지가 리프레쉬 되는데 이를 막아주기 위한 함수

        let body = {
            email: Email,
            password: Password
        } // 정보를 담는 객체

        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert('Error')
                }
            }) // 로그인이 정상적으로 성공한 경우 화면을 이동

        // LoginPage

        // axios.post('/api/user/login', body)
        // .then(response => {

        // }) // POST 방식을 이용해서 전송
        // user.action.js로 함수 이동
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>
                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage;