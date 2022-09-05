import React from "react";
import { connect } from "react-redux";
import { graphql } from "@apollo/client/react/hoc";

import { currencySelector, toggleCurrencyDropdown, toggleCartDropdown } from "../../redux/Cart/cart-action";
import arrow from "../../assets/images/arrow-down.svg";
import { fetchCurrencies } from "../../graphql/queries";

class NavbarCurrency extends React.Component {
    constructor(props) {
      super(props)
      this.currencyDropdownRef = React.createRef()
    }

    componentDidMount() {
      window.addEventListener("click", this.closeBlock)
    }

    componentWillUnmount() {
      window.removeEventListener("click", this.closeBlock)
    }

    render() {
      const currencyDropdown = this.props.toggleCurrencyDropdown
      const { currencySelector } = this.props
      const { dispatchCurrencyDropdown } = this.props
      const { dispatchCartDropdown } = this.props

      const { data: { loading, currencies } } = this.props

      const handleClick = () => {
        dispatchCurrencyDropdown(true)
        dispatchCartDropdown(false)
      }

      this.closeBlock = (e) => {
        this.props.toggleCurrencyDropdown &&
          !e.path.includes(this.currencyDropdownRef.current) &&
            this.props.dispatchCurrencyDropdown(false)
      }
      
      if(loading){
        return <></>
      }else{
        return (
          <div 
            className="navbar__currency" 
            onClick={handleClick}
            ref={this.currencyDropdownRef}
          >
            <span>{this.props.currency}</span>
            <img className={currencyDropdown ? 'changeArrow' : ''} id="arrow-down" src={arrow} alt="arrow" />
              <div className={`currency__dropdown ${currencyDropdown ? 'currency-active' : ''}`}>
                {currencies?.map((currency) => {
                  return (
                    <button
                      onClick={() => currencySelector(currency.symbol)}
                      key={currency.label}
                      className="currency__dropdown--btn"
                    >
                      {currency.symbol} {currency.label}
                    </button>
                  );
                })}
              </div>
          </div>
        )
      }
    }
  }
  
  const mapStateToProps = (state) => {
    return {
      currency: state.cart.currency,
      toggleCurrencyDropdown: state.cart.toggleCurrencyDropdown
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
      currencySelector: (currency) => dispatch(currencySelector(currency)),
      dispatchCurrencyDropdown: (bool) => dispatch(toggleCurrencyDropdown(bool)),
      dispatchCartDropdown: (bool) => dispatch(toggleCartDropdown(bool)),
    }
  }
  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(graphql(fetchCurrencies)(NavbarCurrency))