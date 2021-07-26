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
            })
            
        }, [])
    }

    return AuthenticationCheck
}