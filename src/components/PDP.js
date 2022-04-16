import React, { Component } from 'react';
import {gql} from '@apollo/client'
import { connect } from 'react-redux'

import { addToCart, attributeSelector } from '../redux/Cart/cart-action'

class PDP extends Component {

    constructor(props) {
        super(props)

        this.state = {
            details: [],
            toggleAttr: 0,
        }
    }

    componentDidMount() {
        this.props.client.query({
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
            `
        }).then(response => this.setState({ details: response.data.product }))
    }

    

    render(){
        const { addToCart } = this.props
        const { attributeSelector } = this.props

        const images = []
        for(let item in this.state.details.gallery){
            images.push(this.state.details.gallery[item])
        }
        const imagesCol = images.slice(1)

        const prices = []
        for (let item in this.state.details.prices){
            prices.push(this.state.details.prices[item])
        }

        const attributes = []
        for (let item in this.state.details.attributes){
            attributes.push(this.state.details.attributes[item])
        }
        // console.log(attributes)
        

        return(
            <div className='item__description--container'>
                <div className='item__gallery'>
                    <div className='gallery__col'>
                        {imagesCol.map((item, key) => {
                            return(
                                <img key={key} src={item} alt="img" />
                            )
                        })}
                    </div>
                    <img src={images[0]} alt="mainImg" />
                </div>
                <div className='item__attributes'>
                    <h2>{this.state.details.brand}</h2>
                    <h3>{this.state.details.name}</h3>
                    {attributes.map((item,key) => {
                        return(
                            <div key={key}>
                                <span>{item.name.toUpperCase()}:</span>
                                <br/>
                                    {item.items.map((btn,key) => {
                                        return(
                                            <div className='form_radio_btn'>
                                                <input
                                                    type='radio'
                                                    onClick={() => {attributeSelector(this.state.details.id, item.name, key)}}
                                                    style={item.type === 'swatch' ? {background: `${btn.value}`} : {background: 'white'} }
                                                    // className={this.state.toggleAttr === key ? "toggledAttr" : ""}
                                                    id={btn.id}
                                                />
                                                <label htmlFor={btn.id}>{item.type !== 'swatch' ? btn.value : ''}</label> 
                                            </div>
                                        )
                                    })}
                            </div>  
                        )
                    })}
                    <span>PRICE:</span>
                    <span style={{fontSize: '24px'}}>{prices[this.props.currency]?.currency?.symbol}{prices[this.props.currency]?.amount}</span>
                    <button 
                        onClick={this.state.details.inStock 
                            ? (() => addToCart(this.state.details.id)) 
                            : () => alert} 
                        id={this.state.details.inStock 
                            ? 'add__btn' 
                            : 'add__btn--outOfStock'}
                    >{ this.state.details.inStock ? 'ADD TO CART' : 'OUT OF STOCK' }</button>
                    
                    <div dangerouslySetInnerHTML={{__html: this.state.details.description}}></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return{ 
        currency: state.cart.currency,
        attributes: state.cart.attributes,
    }
}

const mapDispatchToProps = dispatch => {
    return{
        addToCart: (attributes) => dispatch(addToCart(attributes)),
        attributeSelector: (name,id,productID) => dispatch(attributeSelector(name,id,productID)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDP)