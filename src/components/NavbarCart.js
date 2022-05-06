import React, {Component} from 'react'
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { addOne, removeFromCart, subOne, } from "../redux/Cart/cart-action";
import cart from "../assets/images/cart.svg";

class NavbarCart extends Component {
    render(){
        const { addOne } = this.props;
        const { removeFromCart } = this.props;
        const { subOne } = this.props;

        let totalSum = 0;
        let totalQty = 0;
        this.props.cartProducts.forEach((item) => {
            totalSum += item.qty * item.prices[this.props.currency]?.amount;
            totalQty += item.qty;
        });

        return(
            <div className="navbar__cart">
                <img className='pos-relative' src={cart} alt="cart" />
                <button className="totalQty__btn">{totalQty}</button>
                <div className='cart--dropdown'>
                    <p className='mb-40'>
                        <span>My Bag</span>, {this.props.cartProducts.length} items
                    </p>
                    <div className="cart--dropdown__container">
                        {this.props.cartProducts.map((item, key) => {
                        return (
                            <div key={key} className="cart__item--container">
                            <div className="cart__item--info">
                                <span>{item.brand}</span>
                                <span>{item.name}</span>
                                <span>
                                {(item.prices[this.props.currency]?.amount).toFixed(2)}
                                {item.prices[this.props.currency]?.currency.symbol}
                                </span>
                                <div className="attributes__container">
                                {item?.selectedAttr?.attributes.map((attr, key) => {
                                    const attrID = item.id.split(",").slice(1);
                                    return item.attributes.length 
                                        ?   <div key={key} className='attributes__item'>
                                                <span>{Object.keys(attr)[0]}</span>
                                                <button
                                                style={attr.type === "swatch"
                                                    ? {backgroundColor: `${item.attributes[key]?.items[attrID[key]]?.value}`}
                                                    : { background: "white" }
                                                }>
                                                {attr.type !== "swatch"
                                                    ? item.attributes[key]?.items[attrID[key]]?.value
                                                    : ""}
                                                </button>
                                            </div>
                                        :   "";
                                })}
                                </div>
                            </div>
                            <div className='d-flex'>
                                <div className="cart__item--counter">
                                    <button onClick={() => addOne(item.id)}>+</button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => subOne(item.id, item.qty)}>-</button>
                                </div>
                                <div>
                                <img
                                    className="cart__img"
                                    src={item.gallery[0]}
                                    alt={item.id}
                                />
                                <button
                                    className="remove__btn"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    x
                                </button>
                                </div>
                            </div>
                            </div>
                        );
                        })}
                    </div>
                    <div className="cart__total--amount">
                        <span>Total</span>
                        <span>
                            {totalSum.toFixed(2)}
                            {this.props.cartProducts[0]?.prices[this.props.currency]?.currency.symbol}
                        </span>
                    </div>
                    <div className="cart__btn--container">
                        <Link to="/cart">
                            <button className="cart__btn--viewBag">VIEW BAG</button>
                        </Link>
                        <button
                            className="cart__btn--checkOut"
                            onClick={() => {
                                this.props.cartProducts.length
                                ? alert(`checked out ${totalSum.toFixed(2)}
                                    ${this.props.cartProducts[0]?.prices[this.props.currency]?.currency.symbol}`
                                    )
                                : alert("Cart is Empty");
                                window.location.reload();
                            }}
                            >
                            CHECK OUT
                        </button>
                    </div>
                </div>
            </div>
        )
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(NavbarCart);