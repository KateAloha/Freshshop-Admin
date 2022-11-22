import { GET_ALL_PRODUCT_TYPE, PAGINATION } from "src/constants/ProductTypeConstants";

export const getProductTypeAction = () => async dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    try {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/productTypeRouters`, requestOptions);
        const data = await response.json();
        return dispatch({
            type: GET_ALL_PRODUCT_TYPE,
            payload: data.productType
        });
    }
    catch (error) {
        console.log(error)
    }
}



export const ChangeNoPage = (value) => {
    return {
        type: PAGINATION,
        payload: value
    }
}