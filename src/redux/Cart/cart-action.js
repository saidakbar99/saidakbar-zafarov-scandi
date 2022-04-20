import * as actionTypes from './cart-types'

export const addToCart = (itemID) => {
    return{
        type: actionTypes.ADD_TO_CART,
        payload: {
            id: itemID,
        }
    }
}

export const removeFromCart = (itemID) => {
    return{
        type: actionTypes.REMOVE_FROM_CART,
        payload: {
            id: itemID,
        }
    }
}

export const addOne = (itemID) => {
    return{
        type: actionTypes.ADD_ONE,
        payload: {
            id: itemID,
        }
    }
}

export const subOne = (itemID, value) => {
    return{
        type: actionTypes.SUB_ONE,
        payload: {
            id: itemID,
            qty: value,
        }
    }
}

export const attributeSelector = (productID, attributeName, attribute ) => {
    return{
        type: actionTypes.ATTRIBUTE_SELECTOR,
        payload: {
            productID: productID,
            name: attributeName,
            id: attribute,
        }
    }
}

export const currencySelector = (currencyID) => {
    return{
        type: actionTypes.CURRENCY_SELECTOR,
        payload: {
            id: currencyID,
        }
    }
}