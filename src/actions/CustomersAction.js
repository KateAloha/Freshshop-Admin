import { GET_ALL_CUSTOMER, PAGINATION_CUSTOMER } from "src/constants/CustomerConstants";

export const getCustomerAction = () => async dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    try {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/customers`, requestOptions);
        const data = await response.json();
        return dispatch({
            type: GET_ALL_CUSTOMER,
            payload: data.Customer
        });
    }
    catch (error) {
        console.log(error)
    }
}


export const ChangeNoPagecustomer = (value) => {
    return {
        type: PAGINATION_CUSTOMER,
        payload: value
    }
}