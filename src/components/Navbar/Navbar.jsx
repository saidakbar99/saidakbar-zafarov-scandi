import React from "react";

import NavbarCart from "./NavbarCart";
import NavbarCurrency from "./NavbarCurrency";
import Categories from "./Categories";
import logo from "../../assets/images/logo.svg";
import { connect } from "react-redux";

class Navbar extends React.Component {
	render() {
		return (
			<div className={this.props.toggleCartDropdown ? "cart-opened" : ""}>
				<div className="navbar__container">
					<Categories />
					<div className="navbar__logo">
						<img src={logo} alt="logo" />
					</div>
					<div className="navbar__action--container">
						<NavbarCurrency />
						<NavbarCart />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		toggleCartDropdown: state.cart.toggleCartDropdown,
	};
};

export default connect(mapStateToProps)(Navbar);
