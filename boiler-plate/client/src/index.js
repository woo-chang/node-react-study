import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import { applyMiddleware, createStore } from 'redux';
import promiesMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';

import Reducer from './_reducers'

const createStoreWithMiddleware = applyMiddleware(promiesMiddleware, ReduxThunk)(createStore)
// 원래 Store는 Action 객체 밖에 받지 못하지만 Promise와 Function도 받을 수 있도록 해주는 작업

ReactDOM.render(
  <React.StrictMode>
    <Provider
      store={createStoreWithMiddleware(Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
      )} // chrome의 Redux DevTools를 사용하기 위한 인자
    >
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
