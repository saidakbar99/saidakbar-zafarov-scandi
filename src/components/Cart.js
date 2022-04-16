import React, { Component } from 'react';
import { connect } from 'react-redux'

import { addToCart, removeFromCart, subOne } from '../redux/Cart/cart-action';

class Cart extends Component {
    render(){
        const { addToCart } = this.props
        const { removeFromCart } = this.props
        const { subOne } = this.props
        return(
            <div>
                <div className='category__name'><span>Cart</span></div>
                {   
                    this.props.cartProducts.map((item,key) => {
                        return(
                            <div key={key} className="cart__item--container cart__border">
                                <div className='bagCart__item--left'>
                                    <span style={{marginBottom: '30px',fontSize: '40px'}}>{item.name}</span>
                                    <span>{(item.prices[0].amount*item.qty).toFixed(2)}{item.prices[0].currency.symbol}</span>
                                    <div className='cart__item--attributes--container'>
                                        {item.attributes.map((item,key) => {
                                            return(
                                                <div key={key} className='cart__item--attributes'>
                                                    {item.items.map((btn,key) => {
                                                        return(
                                                            <button
                                                                id='attributes__btn'
                                                                key={key} 
                                                                style={item.type === 'swatch' ? {background: `${btn.value}`} : {background: 'white'} }
                                                            >
                                                                {item.type !== 'swatch' ? btn.value : ''}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className='bagCart__item--right'>
                                    <div className='cart__item--counter'>
                                        <button onClick={() => addToCart(item.id)}>+</button>
                                        <span>{item.qty}</span>
                                        <button onClick={() => subOne(item.id, item.qty)}>-</button>
                                    </div>
                                    <img id='cart__img' src={item.gallery[0]} alt={item.id} />
                                    <button onClick={() => removeFromCart(item.id)}>x</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        cartProducts: state.cart.cart,
        allProducts: state.cart.allProducts
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        addToCart: (id) => dispatch(addToCart(id)),
        removeFromCart: (id) => dispatch(removeFromCart(id)),
        subOne: (id,value) => dispatch(subOne(id,value)),
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart) 

