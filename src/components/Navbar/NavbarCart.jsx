import React, {Component} from 'react'
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { 
    addOne,
    removeFromCart,
    subOne,
    toggleCartDropdown,
    toggleCurrencyDropdown,
    cartCleaner
} from "../../redux/Cart/cart-action";
import { productPrice } from '../../helpers/utils';
import cart from "../../assets/images/cart.svg";

class NavbarCart extends Component {
    constructor(props){
        super(props)
        this.cartDropdownRef = React.createRef(null);
    }

    componentDidMount() {
      window.addEventListener("click", this.closeCart);
    }

    componentWillUnmount() {
      window.removeEventListener("click", this.closeCart);
    }
    render(){
        const { addOne } = this.props
        const { removeFromCart } = this.props
        const { subOne } = this.props
        const { dispatchCartDropdown } = this.props
        const { dispatchCurrencyDropdown } = this.props
        const { cartCleaner } = this.props
        const cartDropdown = this.props.toggleCartDropdown
        const activeCurrency = this.props.currency

        this.closeCart = (e) => {
            this.props.toggleCartDropdown && 
                !e.path.includes(this.cartDropdownRef.current) &&
                    this.props.dispatchCartDropdown(false)
        }

        const toggleClick = () => {
            dispatchCartDropdown(true)
            dispatchCurrencyDropdown(false)
        }

        const RemoveProduct = (id) => {
            if(window.confirm('Do you want to remove product?')){
                removeFromCart(id)
            }
        }

        let totalSum = 0
        let totalQty = 0
        this.props.cartProducts.forEach((item) => {
            totalSum += parseInt(item.qty) * productPrice(item,activeCurrency)
            totalQty += item.qty
        })

        const checkOut = () => {
            alert(`checked out ${activeCurrency + totalSum.toFixed(2)}`)
            cartCleaner()
            dispatchCartDropdown(false)
        }
        return(
            <div 
                className="navbar__cart" 
                ref={this.cartDropdownRef}
            >
                <div className='navbar-cart-logo' onClick={toggleClick}>
                    <img className='pos-relative' src={cart} alt="cart" />
                    <button className="totalQty__btn">{totalQty}</button>
                </div>
                <div className={`cart--dropdown ${cartDropdown ? 'cart-active' : ''}`}>
                    <p className='mb-40 fw-500'>
                        <span className='fw-700'>My Bag</span>, {this.props.cartProducts.length} items
                    </p>
                    <div className="cart--dropdown__container">
                        {this.props.cartProducts.map((item, key) => {
                        return (
                            <div key={key} className="cart__item--container">
                                <div className="cart__item--info">
                                    <div className='cart__item--branding'>
                                        <span className='mb-8'>{item.brand}</span>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className='cart__item--price'>
                                        {activeCurrency + productPrice(item, activeCurrency)}
                                    </span>
                                    <div className="attributes__container">
                                    {/* {item?.selectedAttr?.attributes.map((attr, key) => {
                                        const attrID = item.id.split(",").slice(1)
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
                                    })} */}
                                    {item.attributes.map((attr,id) => {
                                        return(
                                            <div key={id} className='cartOverlay__attr--container'>
                                                <span>{attr.attrName}:</span>
                                                <button className='p-2'>
                                                    {attr.attrValue}
                                                </button>
                                            </div>
                                        )
                                    })}
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <div className="cart__item--counter">
                                        <button onClick={() => addOne(item.id)}>+</button>
                                        <span>{item.qty}</span>
                                        <button onClick={() => subOne(item.id, item.qty)}>-</button>
                                    </div>
                                    <div className='cart__item--image'>
                                        <img
                                            className="cart__img"
                                            src={item.gallery[0]}
                                            alt={item.id}
                                        />
                                        <button
                                            className="remove__btn"
                                            onClick={() => RemoveProduct(item.id)}
                                        >
                                            remove
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
                            {activeCurrency + totalSum.toFixed(2)}
                        </span>
                    </div>
                    <div className="cart__btn--container">
                        <Link to="/cart">
                            <button 
                                className="cart__btn--viewBag"
                                onClick={() => dispatchCartDropdown(false)}
                            >
                                VIEW BAG
                            </button>
                        </Link>
                        <button
                            className="cart__btn--checkOut"
                            onClick={() => {
                                this.props.cartProducts.length
                                ? checkOut()
                                : alert("Cart is Empty");
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
      toggleCartDropdown: state.cart.toggleCartDropdown,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      addOne: (id) => dispatch(addOne(id)),
      removeFromCart: (id) => dispatch(removeFromCart(id)),
      subOne: (id, value) => dispatch(subOne(id, value)),
      dispatchCartDropdown: (bool) => dispatch(toggleCartDropdown(bool)),
      dispatchCurrencyDropdown: (bool) => dispatch(toggleCurrencyDropdown(bool)),
      cartCleaner: () => dispatch(cartCleaner())
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(NavbarCart);