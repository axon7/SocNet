import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './reducers'; //rootReducer is index.js
import thunk from 'redux-thunk';
const middleware = [thunk]; //redux thunk is for using functions in actions -> axios.get request

const initialState = {};
const store = createStore(
    rootReducer, 
    initialState, 
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    
    );

export default store;