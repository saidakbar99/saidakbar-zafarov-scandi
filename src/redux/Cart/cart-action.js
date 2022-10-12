import * as actionTypes from './cart-types';

export const addToCart = (product) => {
	return {
		type: actionTypes.ADD_TO_CART,
		payload: product,
	};
};

export const removeFromCart = (itemID) => {
	return {
		type: actionTypes.REMOVE_FROM_CART,
		payload: {
			id: itemID,
		},
	};
};

export const cartCleaner = () => {
	return {
		type: actionTypes.CART_CLEANER,
	};
};

export const addOne = (itemID) => {
	return {
		type: actionTypes.ADD_ONE,
		payload: {
			id: itemID,
		},
	};
};

export const subOne = (itemID, value) => {
	return {
		type: actionTypes.SUB_ONE,
		payload: {
			id: itemID,
			qty: value,
		},
	};
};

export const attributeSelector = (obj) => {
	return {
		type: actionTypes.ATTRIBUTE_SELECTOR,
		payload: obj,
	};
};

export const currencySelector = (currency) => {
	return {
		type: actionTypes.CURRENCY_SELECTOR,
		payload: currency,
	};
};

export const attributeCleaner = () => {
	return {
		type: actionTypes.ATTRIBUTE_CLEANER,
	};
};

export const activeProduct = (productID) => {
	return {
		type: actionTypes.ACTIVE_PRODUCT,
		payload: productID,
	};
};

export const activeCategory = (category) => {
	return {
		type: actionTypes.SET_ACTIVE_CATEGORY,
		payload: category,
	};
};

export const toggleCurrencyDropdown = (bool) => {
	return {
		type: actionTypes.TOGGLE_CURRENCY_DROPDOWN,
		payload: bool,
	};
};

export const toggleCartDropdown = (bool) => {
	return {
		type: actionTypes.TOGGLE_CART_DROPDOWN,
		payload: bool,
	};
};

export const filterAttributes = (obj) => {
	return {
		type: actionTypes.FILTER_ATTRIBUTES,
		payload: obj,
	};
};

export const checkboxCancel = (bool) => {
	return {
		type: actionTypes.CHECKBOX_CANCEL,
		payload: bool,
	};
};

export const isPageChanged = (bool) => {
	return {
		type: actionTypes.IS_PAGE_CHANGED,
		payload: bool,
	};
};

export const warningToaster = (bool) => {
	return {
		type: actionTypes.WARNING_TOASTER,
		payload: bool,
	};
};
