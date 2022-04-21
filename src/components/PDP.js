import React, { Component } from "react";
import { gql } from "@apollo/client";
import { connect } from "react-redux";
import { Parser } from "html-to-react";

import {
  addToCart,
  attributeSelector,
  attributeCleaner,
} from "../redux/Cart/cart-action";

class PDP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      details: [],
    };
  }

  componentDidMount() {
    this.props.client
      .query({
        query: gql`
                {
                    product(id: "${this.props.query}"){
                        id
                        brand
                        name
                        description
                        gallery
                        inStock
                        prices{
                            currency{
                                symbol
                            }
                            amount
                        }
                        attributes{
                            name
                            type
                            items{
                                value
                                id
                            }
                        }
                    }
                }
            `,
      })
      .then((response) => this.setState({ details: response.data.product }));
  }

  render() {
    const { addToCart } = this.props;
    const { attributeSelector } = this.props;
    const { attributeCleaner } = this.props;

    const images = [];
    for (let item in this.state.details.gallery) {
      images.push(this.state.details.gallery[item]);
    }
    const imagesCol = images.slice(1);

    const prices = [];
    for (let item in this.state.details.prices) {
      prices.push(this.state.details.prices[item]);
    }

    const attributes = [];
    for (let item in this.state.details.attributes) {
      attributes.push(this.state.details.attributes[item]);
    }
    return (
      <div className="item__description--container">
        <div className="item__gallery">
          <div className="gallery__col">
            {imagesCol.map((item, key) => {
              return <img key={key} src={item} alt="img" />;
            })}
          </div>
          <img src={images[0]} alt="mainImg" />
        </div>
        <div className="item__attributes">
          <h2>{this.state.details.brand}</h2>
          <h3>{this.state.details.name}</h3>
          {attributes.map((item, key1) => {
            return (
              <div key={key1}>
                <span>{item.name.toUpperCase()}:</span>
                <br />
                {item.items.map((btn, key2) => {
                  let attrs = [];
                  this.props.attributes[0]?.attributes?.forEach((item) => {
                    attrs.push(Object.values(item)[0]);
                  });
                  return (
                    <button
                      key={key2}
                      type="radio"
                      onClick={() => {
                        attributeSelector(
                          this.state.details.id,
                          item.name,
                          key2
                        );
                      }}
                      style={
                        item.type === "swatch"
                          ? { background: `${btn.value}` }
                          : { background: "white" }
                      }
                      className={`attr__btn 
                                                                ${
                                                                  item.type !==
                                                                  "swatch"
                                                                    ? "attr__btn--swatch"
                                                                    : ""
                                                                } 
                                                                ${
                                                                  attrs[
                                                                    key1
                                                                  ] === key2 &&
                                                                  this.state
                                                                    .details
                                                                    .inStock
                                                                    ? "selected"
                                                                    : ""
                                                                }`}
                      id={btn.id}
                    >
                      {item.type !== "swatch" ? btn.value : ""}
                    </button>
                  );
                })}
              </div>
            );
          })}
          <span>PRICE:</span>
          <span style={{ fontSize: "24px" }}>
            {prices[this.props.currency]?.currency?.symbol}
            {prices[this.props.currency]?.amount}
          </span>
          <button
            onClick={
              this.state.details.inStock
                ? () =>
                    addToCart(this.state.details.id) +
                    alert("Item added") +
                    attributeCleaner()
                : () => alert
            }
            id={
              this.state.details.inStock ? "add__btn" : "add__btn--outOfStock"
            }
          >
            {this.state.details.inStock ? "ADD TO CART" : "OUT OF STOCK"}
          </button>
          <div>{Parser().parse(this.state.details.description)}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currency: state.cart.currency,
    attributes: state.cart.attributes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (id) => dispatch(addToCart(id)),
    attributeSelector: (name, id, productID) =>
      dispatch(attributeSelector(name, id, productID)),
    attributeCleaner: () => dispatch(attributeCleaner()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PDP);
