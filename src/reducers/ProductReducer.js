import { GET_ALL_PRODUCT, PAGINATION_PRODUCT, GET_DATA_PRODUCT_BY_ID } from "src/constants/ProductConstants";

const iniData = {
    currentPage_product: 1,
    product: [],
    noPage_product: 0,
    productId: ""
}

const limit = 10;

const ProductReducer = (state = iniData, action) => {
    switch (action.type) {
        case PAGINATION_PRODUCT:
            return {
                ...state,
                currentPage_product: action.payload
            }
        case GET_ALL_PRODUCT:
            return {
                ...state,
                product: action.payload,
                noPage_product: Math.ceil(action.payload.length / limit),
            }
        case GET_DATA_PRODUCT_BY_ID:
            return {
                ...state,
                productId: action.payload,
            }
        default:
            return state;
    }
}

export default ProductReducer;


