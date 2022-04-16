import * as actionTypes from "./cart-types";
import { gql } from "@apollo/client";

import { client } from "../../App";

client
  .query({
    query: gql`
      {
        category {
          products {
            name
            id
            gallery
            prices {
              amount
              currency {
                symbol
              }
            }
            attributes {
              type
              name
              items {
                value
                displayValue
              }
            }
          }
        }
      }
    `,
  })
  .then((response) => {
    response.data.category.products.map((item) => {
      INITIAL_STATE.allProducts.push(item);
    });
  });

const INITIAL_STATE = {
  allProducts: [],
  cart: [],
  currency: 0,
  attributes: [],
};

//========================REDUCER=============================//

const cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      const IdAttr = state.attributes[0]?.attributes.map(attr =>{
        return Object.keys(attr)[0] +"="+ Object.values(attr)[0]
      })  
      const item = state.allProducts.find(
        (prod) => prod.id === action.payload.id
      );
      const inCartItem = state.cart.find((item) =>
        item.id == (action.payload.id+IdAttr) ? true : false
      );
      console.log(inCartItem)
      return {
        ...state,
        cart: inCartItem
          ? state.cart.map((item) =>
              item.id == action.payload.id+IdAttr
                ? { ...item, qty: item.qty + 1 }
                : item
            )
          : [...state.cart, { ...item , qty: 1, selectedAttr: state.attributes[0], id: item.id + IdAttr}],
      };
    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
      };
    case actionTypes.SUB_ONE:
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.qty > 1
            ? item.id == action.payload.id
              ? { ...item, qty: item.qty - 1 }
              : item
            : item
        ),
      };
    case actionTypes.CURRENCY_SELECTOR:
      return { ...state, currency: action.payload.id };
    case actionTypes.ATTRIBUTE_SELECTOR:
      const thisProduct = state.allProducts.find(
        (prod) => prod.id === action.payload.productID
      );
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
                  return Object.keys(attr)[0] == action.payload.name
                    ? (attr[action.payload.name] = action.payload.id)
                    : [...state.attributes];
                });
              }),
            ]
          : [
              {
                id: thisProduct.id,
                attributes: thisProduct.attributes.map((attr) => {
                  return { [attr.name]: action.payload.id, type: attr.type };
                }),
              },
            ],
      };
    default:
      return state;
  }
};

export default cartReducer;