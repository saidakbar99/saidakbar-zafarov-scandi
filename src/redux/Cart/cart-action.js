import * as actionTypes from './cart-types'

export const addToCart = (productData, itemID) => {
    return{
        type: actionTypes.ADD_TO_CART,
        payload: {
            productData: productData,
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

export const attributeSelector = (productData, productID, attributeName, chosenAttribute ) => {
    return{
        type: actionTypes.ATTRIBUTE_SELECTOR,
        payload: {
            productData: productData,
            productID: productID,
            name: attributeName,
            id: chosenAttribute,
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

export const attributeCleaner = () => {
    return{
        type: actionTypes.ATTRIBUTE_CLEANER
    }
}

export const activeProduct = (productID) => {
    return{
        type: actionTypes.ACTIVE_PRODUCT,
        payload: {
            id: productID,
        }
    }
}