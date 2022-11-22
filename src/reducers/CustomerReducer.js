import { GET_ALL_CUSTOMER, PAGINATION_CUSTOMER } from "src/constants/CustomerConstants";

const iniData = {
    currentPage_customer: 1,
    customer: [],
    noPage_customer: 0,
}

const limit = 10;

const customerReducer = (state = iniData, action) => {
    switch (action.type) {
        case PAGINATION_CUSTOMER:
            return {
                ...state,
                currentPage_customer: action.payload
            }
        case GET_ALL_CUSTOMER:
            return {
                ...state,
                customer: action.payload.slice((state.currentPage_customer - 1) * limit, state.currentPage_customer * limit),
                noPage_customer: Math.ceil(action.payload.length / limit),
            }
        default:
            return state;
    }
}

export default customerReducer;


