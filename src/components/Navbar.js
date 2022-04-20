import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {gql} from '@apollo/client'
import { connect } from 'react-redux'

import { addOne, removeFromCart, subOne, currencySelector } from '../redux/Cart/cart-action';

import logo from '../assets/images/logo.svg'
import cart from '../assets/images/cart.svg'
import arrow from '../assets/images/arrow-down.svg'



class Navbar extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            toggleTab: 0,
            categories: [],
            currencies: [],
        }
    }

    componentDidMount() {
        this.props.client.query({
            query: gql`
                {
                    categories{
                        name
                    }

                    currencies{
                        symbol
                        label
                    }
                }
            `
        }).then(response => this.setState({ categories: response.data.categories, currencies: response.data.currencies }))
    }

    changeToggle = (id) => {
        this.setState({ toggleTab: id })
    }

    render(){
        const { addOne } = this.props
        const { removeFromCart } = this.props
        const { subOne } = this.props
        const { currencySelector } = this.props

        let totalSum = 0
        let totalQty = 0
        this.props.cartProducts.forEach(item => {
            totalSum += item.qty * item.prices[this.props.currency]?.amount
            totalQty += item.qty
        })



        return (
          <div className="navbar__container">
            <div className="menu__container">
              {this.state.categories.map((category, id, key) => {
                return (
                  <Link to={`/${category.name}`} key={id}>
                    <button
                        key={key}
                        className={
                        this.state.toggleTab === id ? "active" : "menu__button"
                        }
                        onClick={() => this.changeToggle(id)}
                    >
                        {category.name.charAt(0).toUpperCase() +
                        category.name.slice(1)}
                    </button>
                  </Link>
                );
              })}
            </div>
            
            <img src={logo} alt="logo" />

            <div className="navbar__action--container">
              <div className="navbar__currency">
                <span>{this.state.currencies[this.props.currency]?.symbol}</span>
                <img id="arrow-down" src={arrow} alt="arrow" />
                <div className="currency__dropdown">
                  {this.state.currencies.map((currency, key) => {
                    return (
                      <button onClick={() => currencySelector(key)} key={key} className='currency__dropdown--btn'>
                        {currency.symbol} {currency.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="navbar__cart">
                <img style={{position: 'relative'}} src={cart} alt="cart" />
                <button className='totalQty__btn'>{totalQty}</button>
                <div className="cart--dropdown">
                  <p style={{marginBottom: '40px'}}>
                    <span>My Bag</span>, {this.props.cartProducts.length} items
                  </p>
                  <div className='cart--dropdown__container'>
                    {
                        this.props.cartProducts.map((item,key) => {
                          return(
                              <div key={key} className="cart__item--container" >
                                  <div className='cart__item--info'>
                                      <span>{item.name}</span>
                                      <span>{(item.prices[this.props.currency]?.amount).toFixed(2)}{item.prices[this.props.currency]?.currency.symbol}</span>
                                      <div className='attributes__container'>
                                          {item?.selectedAttr?.attributes.map((attr,key)=>{
                                            const attrID = item.id.split(",").slice(1)
                                              return(
                                                  item.attributes.length
                                                      ?   <button
                                                              key={key}
                                                              style={attr.type === 'swatch' ? {backgroundColor: `${item.attributes[key]?.items[attrID[key]]?.value}`} : {background: 'white'} }
                                                          >
                                                              {attr.type !== 'swatch' ? item.attributes[key]?.items[attrID[key]]?.value : ''}
                                                          </button>
                                                      :   ''
                                              )
                                          })}
                                      </div>
                                  </div>
                                  <div style={{display: 'flex'}}>
                                      <div className='cart__item--counter'>
                                          <button onClick={() => addOne(item.id)}>+</button>
                                          <span>{item.qty}</span>
                                          <button onClick={() => subOne(item.id, item.qty)}>-</button>
                                          
                                      </div>
                                      <div>
                                          <img className='cart__img' src={item.gallery[0]} alt={item.id} />
                                          <button className='remove__btn' onClick={() => removeFromCart(item.id)}>x</button>
                                      </div>
                                  </div>
                              </div>
                          )
                        })
                    }
                  </div>
                  <div className="cart__total--amount">
                    <span>Total</span>
                    <span>{totalSum.toFixed(2)}{this.props.cartProducts[0]?.prices[this.props.currency]?.currency.symbol}</span>
                  </div>
                  <div className="cart__btn--container">
                    <Link to='/cart'><button className="cart__btn--viewBag">VIEW BAG</button></Link>
                    <button className="cart__btn--checkOut" 
                      onClick={() => {
                        this.props.cartProducts.length 
                          ? alert(`checked out ${totalSum.toFixed(2)}${this.props.cartProducts[0]?.prices[this.props.currency]?.currency.symbol}`)
                          : alert('Cart is Empty');
                        window.location.reload();
                        }}
                      >CHECK OUT</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        cartProducts: state.cart.cart,
        allProducts: state.cart.allProducts,
        currency: state.cart.currency,
        attributes: state.cart.attributes,
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        addOne: (id) => dispatch(addOne(id)),
        removeFromCart: (id) => dispatch(removeFromCart(id)),
        subOne: (id,value) => dispatch(subOne(id,value)),
        currencySelector: (id) => dispatch(currencySelector(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)