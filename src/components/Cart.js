import React, { Component } from 'react';
import { connect } from 'react-redux'

import { addOne, removeFromCart, subOne } from '../redux/Cart/cart-action';

class Cart extends Component {
    render(){
        const { addOne } = this.props
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
                                    {item?.selectedAttr?.attributes.map((attr,key)=>{
                                          const attrID = item.id.split(",").slice(1)
                                            return(
                                                item.attributes.length
                                                    ?   <button
                                                            id='attributes__btn'
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
                                <div className='bagCart__item--right'>
                                    <div className='cart__item--counter'>
                                        <button onClick={() => addOne(item.id)}>+</button>
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
        addOne: (id) => dispatch(addOne(id)),
        removeFromCart: (id) => dispatch(removeFromCart(id)),
        subOne: (id,value) => dispatch(subOne(id,value)),
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart) 

