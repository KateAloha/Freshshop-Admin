import { GET_ALL_ORDER, PAGINATION_ORDER } from "src/constants/OrdersConstants";

const iniData = {
    currentPage_order: 1,
    order: [],
    noPage_order: 0,
}

const limit = 10;

const orderReducer = (state = iniData, action) => {
    switch (action.type) {
        case PAGINATION_ORDER:
            return {
                ...state,
                currentPage_order: action.payload
            }
        case GET_ALL_ORDER:
            return {
                ...state,
                order: action.payload,
                noPage_order: Math.ceil(action.payload.length / limit),
            }

        default:
            return state;
    }
}

export default orderReducer;


