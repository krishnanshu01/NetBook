import { createStore , applyMiddleware} from 'redux' //creating store and using applymiddleware for authentication
import { composeWithDevTools } from 'redux-devtools-extension'; // for using redux dev tools 
import thunk from 'redux-thunk'; // we are going to use it for middleware
import rootReducer from './reducers' //jha se sb start hoga

//making intitialstate empty
const initialState = {};

const middleware = [thunk]; //thunk is use for middleware as i descirbed it earler

//going to make a store

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

