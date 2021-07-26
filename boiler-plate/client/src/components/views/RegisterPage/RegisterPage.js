import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action'

function RegisterPage(props) {

    const dispatch = useDispatch();

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        // 버튼을 누르게 되면 페이지가 리프레쉬 되는데 이를 막아주기 위한 함수

        if(Password !== ConfirmPassword) {
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
        } // 같지 않다면 아래로 진입 불가

        let body = {
            email: Email,
            password: Password,
            name: Name
        } // 정보를 담는 객체

        dispatch(registerUser(body)) // Action 날리는 동작
            .then(response => {
                if(response.payload.success) {
                    props.history.push('/login')
                } else {
                    alert("Failed to sign up")
                }
            }) 

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

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler}/>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>
                
                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default RegisterPage;