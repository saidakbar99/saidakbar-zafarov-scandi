import React, { Component } from "react";
import { connect } from "react-redux";

import { addOne, removeFromCart, subOne } from "../redux/Cart/cart-action";
import CarouselBtn from '../assets/images/carousel-btn.svg'

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeImg: []
    }
  }

  componentDidMount() {
    const imageCopy = []
    for(let i=0; this.props.cartProducts.length>i; i++){
      imageCopy.push(0)
      this.setState({ activeImg: imageCopy})
    }
  }
  
  render() {
    const { addOne } = this.props;
    const { removeFromCart } = this.props;
    const { subOne } = this.props;
    const img = this.state.activeImg
    const imgCopy = [...img]


    function nextImage(len,key){
      let i = img[key]
      i++
      i = i % len
      this.setState(prevState => ({
        activeImg: {
          ...prevState.activeImg,
          [prevState.activeImg[key]]: i
        }
      }))
      // img[key] = i
      // this.setState({ activeImg: imgCopy })
    }

    function previousImage(len,key){
      let i = imgCopy[key]
      i--
      if(i<0){ i+=len }
      imgCopy[key] = i
    }

    let totalSum = 0;
    let totalQty = 0;
    this.props.cartProducts.forEach((item) => {
      totalSum += item.qty * item.prices[this.props.currency]?.amount;
      totalQty += item.qty;
    })

    return (
      <div>
        <div className="category__name">
          <span>Cart</span>
        </div>
        {this.props.cartProducts.map((item, key1) => {
          
          return (
            <div key={key1} className="cart__item--container cart__border">
              <div className="bagCart__item--left">
                <span>{item.brand}</span>
                <span style={{ marginBottom: "30px", fontSize: "40px" }}>
                  {item.name}
                </span>
                <span>
                  {(item.prices[0].amount).toFixed(2)}
                  {item.prices[0].currency.symbol}
                </span>
                <div className="cart__item--attributes--container">
                  {item?.selectedAttr?.attributes.map((attr, key) => {
                    const attrID = item.id.split(",").slice(1);
                    console.log([Object.keys(attr)[0]])
                    return item.attributes.length ? (
                      
                      <div className="cart__item--attributes">
                        <span>
                          {[Object.keys(attr)[0]]}: 
                        </span>
                        <button
                          className="cart__item--attributes--btn"
                          key={key}
                          style={attr.type === "swatch"
                              ? {backgroundColor: `${item.attributes[key]?.items[attrID[key]]?.value}`}
                              : {background: "white" }
                          }
                        >
                          {attr.type !== "swatch"
                            ? item.attributes[key]?.items[attrID[key]]?.value
                            : ""}
                        </button>
                      </div>
                    ) : (
                      ""
                    );
                  })}
                </div>
              </div>
              <div className="bagCart__item--right">
                <div className="cart__item--counter">
                  <button onClick={() => addOne(item.id)}>+</button>
                  <span>{item.qty}</span>
                  <button onClick={() => subOne(item.id, item.qty)}>-</button>
                </div>
                <div className="carousel__img">
                  <img className="carousel__btn left_btn" src={CarouselBtn} alt='left-btn' 
                    onClick={() => previousImage(item.gallery.length,key1)} 
                  />
                  {console.log(img[key1])}
                  <img id="cart__img" src={item.gallery[img[key1]]} alt={item.id} />
                  <img className="carousel__btn" src={CarouselBtn} alt='right-btn' 
                    onClick={() => nextImage(item.gallery.length,key1)} 
                  />
                </div>
                <button onClick={() => removeFromCart(item.id)}>x</button>
              </div>
            </div>
          );
        })}
        <div className="totalOrder">
          <p>
            Tax:  
            <span>
              {this.props.cartProducts[0]?.prices[this.props.currency]?.currency.symbol}
              {(totalSum * 0.05).toFixed(2)}
            </span>
          </p>
          <p>Qty:<span>{totalQty}</span></p>
          <p>
            Total: 
            <span>
              {this.props.cartProducts[0]?.prices[this.props.currency]?.currency.symbol}
              {totalSum.toFixed(2)}
            </span>
          </p>
          <button className="cart__btn--checkOut OrderSize">ORDER</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartProducts: state.cart.cart,
    currency: state.cart.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addOne: (id) => dispatch(addOne(id)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    subOne: (id, value) => dispatch(subOne(id, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
