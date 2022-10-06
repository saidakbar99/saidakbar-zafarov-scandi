import * as actionTypes from "./cart-types";

const INITIAL_STATE = {
	cart: [],
	currency: "$",
	attributes: [],
	activeProduct: "",
	activeCategory: "all",
	toggleCurrencyDropdown: false,
	toggleCartDropdown: false,
	filterAttributes: {},
	checkboxCancel: false,
	isPageChanged: false,
};

const cartReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case actionTypes.ADD_TO_CART:
			const idFromAttrs = state.attributes.map((attr) => {
				return Object.values(attr)[1];
			});
			const idWithAttrs = action.payload.id + "-" + idFromAttrs.join("-");
			const addedProduct = action.payload;

			const isDuplicateProduct = state.cart.find((product) =>
				product.id === idWithAttrs ? true : false
			);
			return {
				...state,
				cart: isDuplicateProduct
					? state.cart.map((product) => {
							return product.id === idWithAttrs ? { ...product, qty: product.qty + 1 } : product;
					  })
					: [
							...state.cart,
							{
								...addedProduct,
								qty: 1,
								id: idWithAttrs,
								chosenAttributes: state.attributes,
							},
					  ],
			};
		case actionTypes.REMOVE_FROM_CART:
			return {
				...state,
				cart: state.cart.filter((item) => item.id !== action.payload.id),
			};
		case actionTypes.CART_CLEANER:
			return {
				...state,
				cart: [],
			};
		case actionTypes.ADD_ONE:
			return {
				...state,
				cart: state.cart.map((item) =>
					item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
				),
			};
		case actionTypes.SUB_ONE:
			return {
				...state,
				cart: state.cart.map((item) =>
					item.qty > 1
						? item.id === action.payload.id
							? { ...item, qty: item.qty - 1 }
							: item
						: item
				),
			};
		case actionTypes.CURRENCY_SELECTOR:
			return { ...state, currency: action.payload };
		case actionTypes.ATTRIBUTE_SELECTOR:
			return {
				...state,
				attributes: !state.attributes.find((prod) => prod.attrName === action.payload.attrName)
					? [...state.attributes, action.payload]
					: state.attributes.map((attr) => {
							if (attr.attrName === action.payload.attrName) {
								return action.payload;
							} else {
								return attr;
							}
					  }),
			};
		case actionTypes.ATTRIBUTE_CLEANER:
			return { ...state, attributes: [] };
		case actionTypes.ACTIVE_PRODUCT:
			return { ...state, activeProduct: action.payload };
		case actionTypes.SET_ACTIVE_CATEGORY:
			return { ...state, activeCategory: action.payload };
		case actionTypes.TOGGLE_CURRENCY_DROPDOWN:
			return {
				...state,
				toggleCurrencyDropdown: action.payload ? !state.toggleCurrencyDropdown : false,
			};
		case actionTypes.TOGGLE_CART_DROPDOWN:
			return {
				...state,
				toggleCartDropdown: action.payload ? !state.toggleCartDropdown : false,
			};
		case actionTypes.FILTER_ATTRIBUTES:
			return {
				...state,
				filterAttributes: action.payload,
			};
		case actionTypes.CHECKBOX_CANCEL:
			return {
				...state,
				checkboxCancel: action.payload,
			};
		case actionTypes.IS_PAGE_CHANGED:
			return {
				...state,
				isPageChanged: action.payload,
			};
		default:
			return state;
	}
};

export default cartReducer;
