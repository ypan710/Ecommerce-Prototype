import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import messageReducer from './redux/reducers/messageReducer';
import userInfoReducer from './redux/reducers/userInfoReducer';
import listingCreationReducer from './redux/reducers/listingCreationReducer';
import inquiryReducer from './redux/reducers/inquiryReducer';
import { insertMessage } from './redux/actions/messageActions';
import { setUserInformation } from './redux/actions/userInfoActions';
import { setUpdate } from './redux/actions/inquiryActions';


const rootReducer = combineReducers({
  messageReducer,
  userInfoReducer,
  listingCreationReducer,
  inquiryReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

// const webSocket = new WebSocket('ws://' + window.location.host.split(':')[0] + (window.location.port && `:${window.location.port}`) + '/websocket');
const webSocket = new WebSocket('ws://' + window.location.host.split(':')[0] + (window.location.port && `:${3001}`));

webSocket.onopen = () => {
  console.log('Websocket opened!');
}

webSocket.onmessage = (message) => {
  console.log("ws: ", message)
  store.dispatch(setUpdate(message.data));
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
