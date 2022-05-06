import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "@apollo/client/react/hoc";
import { connect } from "react-redux";

import NavbarCart from './NavbarCart'
import NavbarCurrency from "./NavbarCurrency";
import { currencySelector } from "../redux/Cart/cart-action";
import { fetchCategories} from "../graphql/queries";

import logo from "../assets/images/logo.svg";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggleTab: 0,
    };
  }

  changeToggle = (id) => {
    this.setState({ toggleTab: id });
  };


  render() {
    return (
      <div className="navbar__container">
        <div className="menu__container">
          {this.props.data.categories?.map((category, id, key) => {
            return (
              <Link to={`/${category.name === 'all' ? '' : category.name}`} key={id}>
                <button
                  key={key}
                  className={this.state.toggleTab === id ? "active" : "menu__button"}
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
          <NavbarCurrency />
          <NavbarCart />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(graphql(fetchCategories)(Navbar));
