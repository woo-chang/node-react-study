import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) { // 아무것도 안쓰면 기본으로 null을 의미하는 ES6 문법

    // 옵션의 종류
    // null : 아무나 출입이 가능한 페이지
    // true : 로그인한 유저만 출입이 가능한 페이지
    // false : 로그인한 유저는 출입 불가능한 페이지


    function AuthenticationCheck(props) {
        
        const dispatch = useDispatch()

        // 백엔드에 Request를 날려서 그 사람의 현재 상태를 가져오는 작업
        useEffect(() => {

            // redux 사용, 액션 이름은 auth
            dispatch(auth()).then(response => {
                console.log(response)

                // 로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) { // option이 true인 상태로 들어갈려고 하면 막도록
                        props.history.push('/login')
                    }
                } else {
                    // 로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) { // admin이 아닌데 admin만 들어갈 수 있는 페이지 들어갈 때
                        props.history.push('/')
                    } else {
                        if(option === false) { // 로그인 한 유저가 갈 수 없는 페이지 접근 ex) 로그인 페이지 등
                            props.history.push('/')
                        }
                    }

                }
            })
            
        }, [])

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}