import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { graphql } from "@apollo/client/react/hoc";

import { addToCart, activeProduct } from "../redux/Cart/cart-action";
import { fetchProducts } from '../graphql/queries'

import buyBtn from "../assets/images/buy-btn.svg";

class PLP extends Component {
  render() {
    const { addToCart } = this.props;

    const query = this.props.query
    const category = this.props.data.category
    
    return (
      <div>
        <div className="category__name">
          <span>
            {query.charAt(0).toUpperCase() + query.slice(1)}
          </span>
        </div>
        <div className="itemsBox__container">
          {category?.products.map((item, key) => {
            return (
              <Link to={`/${item.id}`} key={key} onClick={() => activeProduct(item.id)}>
                <div
                  
                  key={key}
                  className={
                    item.inStock
                      ? "items__container"
                      : "items__container--outOfStock"
                  }
                >
                  <div
                    className={item.inStock ? "items" : ""}
                    style={{ position: "relative " }}
                  >
                    <img
                      className={item.inStock ? "" : "outOfStock__img"}
                      src={item.gallery[0]}
                      alt={item.id}
                    />
                    {item.attributes.length ? (
                      <Link to={`/${item.id}`}>
                        <div
                          className="buyBtn"
                          onClick={() =>
                            alert("Please, select product options!")
                          }
                        >
                          <img src={buyBtn} alt="buyBtn" />
                        </div>
                      </Link>
                    ) : (
                      <Link to="">
                        <div
                          className="buyBtn"
                          onClick={() => addToCart(item,item.id)}
                        >
                          <img src={buyBtn} alt="buyBtn" />
                        </div>
                      </Link>
                    )}
                    <div
                      className={item.inStock ? "inStock" : "outOfStock__text"}
                    >
                      <p>OUT OF STOCK</p>
                    </div>
                    <div className="item__brand">
                      <span>{item.brand} {item.name}</span>
                        <span>
                        {item.prices[this.props.currencyID]?.currency.symbol}
                        {item.prices[this.props.currencyID]?.amount}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currencyID: state.cart.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (id) => dispatch(addToCart(id)),
    activeProduct: (id) => dispatch(activeProduct(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(
  graphql(fetchProducts, {
    options: (props) => ({
      variables: { title: props.query ?? 'all'},
    })
  })(PLP)
);
