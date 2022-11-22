import { GET_ALL_ORDER, PAGINATION_ORDER } from "src/constants/OrdersConstants";

export const getOrderAction = () => async dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    try {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/orders`, requestOptions);
        const data = await response.json();
        return dispatch({
            type: GET_ALL_ORDER,
            payload: data.orderList
        });
    }
    catch (error) {
        console.log(error)
    }
}

export const ChangeNoPageOrder = (value) => {
    return {
        type: PAGINATION_ORDER,
        payload: value
    }
}