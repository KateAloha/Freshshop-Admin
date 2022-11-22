const { PAGINATION, GET_ALL_PRODUCT_TYPE } = require("src/constants/ProductTypeConstants");

const iniData = {
    currentPage: 1,
    productType: [],
    noPage: 0,

}

const limit = 10;

const ProductTypeReducer = (state = iniData, action) => {
    switch (action.type) {
        case PAGINATION:
            return {
                ...state,
                currentPage: action.payload
            }
        case GET_ALL_PRODUCT_TYPE:
            return {
                ...state,
                productType: action.payload,
                noPage: Math.ceil(action.payload.length / limit),
            }
        default:
            return state;
    }
}


export default ProductTypeReducer;


