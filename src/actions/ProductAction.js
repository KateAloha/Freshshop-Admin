import { GET_ALL_PRODUCT, PAGINATION_PRODUCT, GET_DATA_PRODUCT_BY_ID } from "src/constants/ProductConstants";

export const getProductAction = () => async dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    try {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/productRouters`, requestOptions);
        const data = await response.json();
        return dispatch({
            type: GET_ALL_PRODUCT,
            payload: data.productList
        });
    }
    catch (error) {
        console.log(error)
    }
}

export const getProductByIdAction = (paramId) => async dispatch => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    try {
        const response = await fetch(`https://freshop-backendcloud.herokuapp.com/productRouters/${paramId}`, requestOptions);
        const data = await response.json();
        return dispatch({
            type: GET_DATA_PRODUCT_BY_ID,
            payload: data.product
        });
    }
    catch (error) {
        console.log(error)
    }
}

export const ChangeNoPageProduct = (value) => {
    return {
        type: PAGINATION_PRODUCT,
        payload: value
    }
}