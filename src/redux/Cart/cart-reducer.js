import * as actionTypes from "./cart-types";

const INITIAL_STATE = {
  cart: [],
  currency: 0,
  attributes: [],
  activeProduct: "",
};

//========================REDUCER=============================//

const cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      const IdAttr = state.attributes[0]?.attributes.map(attr =>{
        return Object.values(attr)[0]
      })  
      const item = action.payload.productData
      const inCartItem = state.cart.find((item) =>
        item.id === (action.payload.id+","+IdAttr) ? true : false
      );
      return {
        ...state,
        cart: inCartItem
          ? state.cart.map((item) =>
              item.id === action.payload.id+","+IdAttr
                ? { ...item, qty: item.qty + 1 }
                : item
            )
          : [...state.cart, { ...item , qty: 1, selectedAttr: state.attributes[0], id: action.payload.id + "," + IdAttr}],
      };
    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
      };
    case actionTypes.ADD_ONE:
      return {
        ...state,
        cart: state.cart.map((item) =>
                item.id === action.payload.id
                  ? { ...item, qty: item.qty + 1 }
                  : item
        )
      }
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
      return { ...state, currency: action.payload.id };
    case actionTypes.ATTRIBUTE_SELECTOR:
      const inAttr = state.attributes.find(
        (prod) => prod.id === action.payload.productID
      )
        ? true
        : false;
      return {
        ...state,
        attributes: inAttr
          ? [
              state.attributes.find((prod) => {
                return prod.attributes.map((attr) => {
                  return Object.keys(attr)[0] === action.payload.name
                    ? (attr[action.payload.name] = action.payload.id)
                    : [...state.attributes];
                });
              }),
            ]
          : [
              {
                id: action.payload.productID,
                attributes: action.payload.productData.attributes.map((attr) => {
                  return { [attr.name]: action.payload.id, type: attr.type };
                }),
              },
            ],
      };
    case actionTypes.ATTRIBUTE_CLEANER:
      return {...state, attributes: []}
    case actionTypes.ACTIVE_PRODUCT:
      return {...state, activeProduct: action.payload.id}
    default:
      return state;
  }
};

export default cartReducer;