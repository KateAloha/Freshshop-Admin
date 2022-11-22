import changeState from "./store";
import ProductTypeReducer from './ProductTypeReducer';
import ProductReducer from "./ProductReducer";
import orderReducer from "./OrderReducer";
import customerReducer from "./CustomerReducer";



const { combineReducers } = require("redux");


const rootReducer = combineReducers({
    changeState,
    ProductTypeReducer,
    ProductReducer,
     orderReducer,
     customerReducer
})

export default rootReducer;