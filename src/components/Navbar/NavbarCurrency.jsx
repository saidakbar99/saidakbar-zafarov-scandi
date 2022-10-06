import React from "react";
import { connect } from "react-redux";
import { graphql } from "@apollo/client/react/hoc";

import {
	currencySelector,
	toggleCurrencyDropdown,
	toggleCartDropdown,
} from "../../redux/Cart/cart-action";
import arrow from "../../assets/images/arrow-down.svg";
import { fetchCurrencies } from "../../graphql/queries";

class NavbarCurrency extends React.Component {
	constructor(props) {
		super(props);
		this.currencyDropdownRef = React.createRef();
	}

	componentDidMount() {
		window.addEventListener("click", this.closeBlock);
	}

	componentWillUnmount() {
		window.removeEventListener("click", this.closeBlock);
	}

	closeBlock = (e) => {
		const { toggleCurrencyDropdown, dispatchCurrencyDropdown } = this.props;
		if (toggleCurrencyDropdown) {
			if (!e.path.includes(this.currencyDropdownRef.current)) {
				dispatchCurrencyDropdown(false);
			}
		}
	};

	handleClick = () => {
		const { dispatchCurrencyDropdown, dispatchCartDropdown } = this.props;
		dispatchCurrencyDropdown(true);
		dispatchCartDropdown(false);
	};

	renderActiveCurrency() {
		const { currency, toggleCurrencyDropdown } = this.props;
		return (
			<>
				<span>{currency}</span>
				<img
					className={`${toggleCurrencyDropdown && "changeArrow"}`}
					id="arrow-down"
					src={arrow}
					alt="arrow"
				/>
			</>
		);
	}

	renderAllCurrencies() {
		const {
			currencySelector,
			toggleCurrencyDropdown,
			data: { currencies },
		} = this.props;
		return (
			<div className={`currency__dropdown ${toggleCurrencyDropdown && "currency-active"}`}>
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
		);
	}

	renderNavbarCurrencyContent() {
		const {
			data: { loading },
		} = this.props;
		if (loading) {
			return <></>;
		} else {
			return (
				<div className="navbar__currency" onClick={this.handleClick} ref={this.currencyDropdownRef}>
					{this.renderActiveCurrency()}
					{this.renderAllCurrencies()}
				</div>
			);
		}
	}

	render() {
		return <>{this.renderNavbarCurrencyContent()}</>;
	}
}

const mapStateToProps = (state) => {
	return {
		currency: state.cart.currency,
		toggleCurrencyDropdown: state.cart.toggleCurrencyDropdown,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		currencySelector: (currency) => dispatch(currencySelector(currency)),
		dispatchCurrencyDropdown: (bool) => dispatch(toggleCurrencyDropdown(bool)),
		dispatchCartDropdown: (bool) => dispatch(toggleCartDropdown(bool)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(graphql(fetchCurrencies)(NavbarCurrency));
