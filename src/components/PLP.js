import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {gql} from '@apollo/client'
import { connect } from 'react-redux'

import { addToCart } from '../redux/Cart/cart-action'

import buyBtn from '../assets/images/buy-btn.svg'


class PLP extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
        }
        
    }

    componentDidMount() {
        this.props.client.query({
            query: gql`
                {
                    category(input: {title: "${this.props.query}" }){
                        products{
                          id
                          name
                          brand
                          gallery
                          category
                          inStock
                          attributes{
                            id
                          }
                          prices{
                            currency{
                              symbol
                            }
                            amount
                          }
                        }
                    }
                }
            `
        }).then(response => this.setState({ products: response.data.category.products }))
    }

    componentDidUpdate(props) {
        if(props.query !== this.props.query){
            this.props.client.query({
                query: gql`
                    {
                        category(input: {title: "${this.props.query}" }){
                            products{
                              id
                              name
                              brand
                              gallery
                              category
                              inStock
                              attributes{
                                id
                              }
                              prices{
                                currency{
                                  symbol
                                }
                                amount
                              }
                            }
                        }
                    }
                `
            }).then(response => this.setState({ products: response.data.category.products }))
        }
    }
    
    render(){
        const { addToCart } = this.props
        return(
            <div>
                <div className='category__name'>
                    <span>{this.props.query.charAt(0).toUpperCase() + this.props.query.slice(1)}</span>
                </div>

                <div className='itemsBox__container'>
                    { this.state.products.map((item, key) => {
                        return (
                            <Link to={`/${item.id}`} key={key}>
                                <div key={key} className={item.inStock ? 'items__container' : 'items__container--outOfStock'}>
                                    <div className={item.inStock ? 'items' : ''} style={{position: 'relative '}}>
                                        <img className={item.inStock ? '' : 'outOfStock__img'} src={item.gallery[0]} alt={item.id}/>
                                            {
                                                item.attributes.length 
                                                    ?   <Link to={`/${item.id}`}>
                                                            <div className='buyBtn' onClick={() => alert('Please, select product options!')}>
                                                                <img src={buyBtn} alt='buyBtn' />
                                                            </div>
                                                        </Link>
                                                    
                                                    :   <Link to=''>
                                                            <div className='buyBtn' onClick={() => addToCart(item.id)}>
                                                                <img src={buyBtn} alt='buyBtn' />
                                                            </div>
                                                        </Link>
                                            }
                                        <div className={item.inStock ? 'inStock' : 'outOfStock__text'}>
                                            <p>OUT OF STOCK</p>
                                        </div>
                                        <p>{item.name}</p>
                                        <span>{item.prices[this.props.currencyID]?.currency.symbol}{item.prices[this.props.currencyID]?.amount}</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{
        currencyID: state.cart.currency,
        allProducts: state.cart.allProducts,
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        addToCart: (id) => dispatch(addToCart(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PLP)