import {
    LOGIN_USER, REGISTER_USER
} from '../_actions/types'

export default function (state = {}, action) {
    switch (action.type) { // 타입이 엄청 많을 예정이므로 switch 문법 사용
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload }
            break;
        default:
            return state;
    }
}