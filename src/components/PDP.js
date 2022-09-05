import React, { Component } from "react";
import { connect } from "react-redux";
import { Parser } from "html-to-react";
import { graphql } from "@apollo/client/react/hoc";

import { fetchProduct } from "../graphql/queries";
import {addToCart, attributeSelector, attributeCleaner} from "../redux/Cart/cart-action";

class PDP extends Component {
  constructor(props) {
    super(props);
    this.state = { mainImage: 0 };
  }

  toggleImage = (id) => {
    this.setState({ mainImage: id })
  }

  render() {
    const product = this.props.data?.product

    const { addToCart } = this.props;
    const { attributeSelector } = this.props;
    const { attributeCleaner } = this.props;

    const images = [];
    for (let item in product?.gallery) {
      images.push(product.gallery[item]);
    }
    const prices = [];
    for (let item in product?.prices) {
      prices.push(product.prices[item]);
    }
    const attributes = [];
    for (let item in product?.attributes) {
      attributes.push(product.attributes[item]);
    }
    return (
      
      <div className="item__description--container">
        <div className="item__gallery">
          <div className="gallery__col">
            {images.map((item, key) => {
              return <img key={key} src={item} alt="img" onClick={() => this.toggleImage(key)} />;
            })}
          </div>
          <img src={images[this.state.mainImage]} alt="mainImg" />
        </div>
        <div className="item__attributes">
          <h2>{product?.brand}</h2>
          <h3>{product?.name}</h3>
          {attributes.map((item, key1) => {
            return (
              <div key={key1}>
                <span>{item.name.toUpperCase()}:</span>
                <br />
                {item.items.map((btn, key2) => {
                  let attrs = [];
                  this.props.attributes[0]?.attributes?.forEach((item) => {
                    attrs.push(Object.values(item)[0]);
                  })
                  return (
                      <button
                        key={key2}
                        type="radio"
                        onClick={() => attributeSelector(product,product.id,item.name,key2)}
                        style={
                          item.type === "swatch"
                            ? { background: `${btn.value}` }
                            : { background: "white" }
                        }
                        className={`attr__btn 
                          ${ item.type !== "swatch" ? "attr__btn--notSwatch" : "attr__btn--swatch"} 
                          ${ attrs[key1] === key2 && product?.inStock && item.type !== 'swatch' ? "selected" : ""}
                          ${ attrs[key1] === key2 && product?.inStock && item.type === 'swatch' ? "selected--swatch" : ""}
                        `}
                        id={btn.id}
                      >
                        {item.type !== "swatch" ? btn.value : ""}
                      </button>
                  )
                })}
              </div>
            );
          })}
          <span>PRICE:</span>
          <span className="fz-24">
            {prices[this.props.currency]?.currency?.symbol}
            {prices[this.props.currency]?.amount}
          </span>
          <button
            onClick={
              product?.inStock
                ? () => addToCart(product, product.id) + alert("Item added") + attributeCleaner()
                : () => alert
            }
            id={product?.inStock ? "add__btn" : "add__btn--outOfStock"}
          >
            {product?.inStock ? "ADD TO CART" : "OUT OF STOCK"}
          </button>
          <div>{Parser().parse(product?.description)}</div>
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
    attributeSelector: (productData, name, id, productID) => dispatch(attributeSelector(productData, name, id, productID)),
    attributeCleaner: () => dispatch(attributeCleaner()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  graphql(fetchProduct, {
    options: (props) => ({
      variables: { id: props.query},
    })
  })(PDP)
);;