import React, { Component } from "react";
import { connect } from "react-redux";
import { gql } from "@apollo/client";

import { currencySelector } from "../redux/Cart/cart-action";
import { client } from '../graphql/client'

import arrow from "../assets/images/arrow-down.svg";
class NavbarCurrency extends Component {
    constructor(props) {
      super(props);
      this.state = {
        currencies: [],
        showCurrencies: false,
      };
    }

    componentDidMount() {
      client.query({
          query: gql`
            {
              currencies {
                symbol
                label
              }
            }
          `,
        })
        .then((response) =>
          this.setState({ currencies: response.data.currencies })
        );
    }
  
    showCurrencies = () => {
      this.setState({ showCurrencies: !this.state.showCurrencies });
    }
  
    render() {
      const { currencySelector } = this.props;
      return (
            <div className="navbar__currency" onClick={this.showCurrencies}>
              <span>{this.state.currencies[this.props.currency]?.symbol}</span>
              <img className={this.state.showCurrencies ? 'changeArrow' : ''} id="arrow-down" src={arrow} alt="arrow" />
              <div className={`currency__dropdown ${this.state.showCurrencies ? 'd-block' : 'd-none'}`}>
                {this.state.currencies?.map((currency, key) => {
                  return (
                    <button
                      onClick={() => currencySelector(key)}
                      key={key}
                      className="currency__dropdown--btn"
                    >
                      {currency.symbol} {currency.label}
                    </button>
                  );
                })}
              </div>
            </div>
      );
    }
  }
  
  const mapStateToProps = (state) => {
    return {
      currency: state.cart.currency,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      currencySelector: (id) => dispatch(currencySelector(id)),
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(NavbarCurrency);