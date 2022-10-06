import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {
	addOne,
	removeFromCart,
	subOne,
	toggleCartDropdown,
	toggleCurrencyDropdown,
	cartCleaner,
	activeCategory,
} from "../../redux/Cart/cart-action";
import { productPrice } from "../../helpers/utils";
import cart from "../../assets/images/cart.svg";

class NavbarCart extends React.Component {
	constructor(props) {
		super(props);
		this.cartDropdownRef = React.createRef(null);
	}

	closeCart = (e) => {
		const { toggleCartDropdown, dispatchCartDropdown } = this.props;
		if (toggleCartDropdown) {
			if (!e.path.includes(this.cartDropdownRef.current)) {
				dispatchCartDropdown(false);
			}
		}
	};

	componentDidMount() {
		window.addEventListener("click", this.closeCart);
	}

	componentWillUnmount() {
		window.removeEventListener("click", this.closeCart);
	}

	toggleClick = () => {
		const { dispatchCurrencyDropdown, dispatchCartDropdown } = this.props;
		dispatchCartDropdown(true);
		dispatchCurrencyDropdown(false);
	};

	RemoveProduct = (id) => {
		const { removeFromCart } = this.props;
		if (window.confirm("Do you want to remove product?")) {
			removeFromCart(id);
		}
	};

	getTotal = (type) => {
		const { currency, cartProducts } = this.props;
		let totalSum = 0;
		let totalQty = 0;

		if (type === "sum") {
			cartProducts.forEach((item) => {
				totalSum += parseInt(item.qty) * productPrice(item, currency);
			});
			return totalSum;
		}

		if (type === "qty") {
			cartProducts.forEach((item) => {
				totalQty += item.qty;
			});
			return totalQty;
		}
	};

	checkOut = () => {
		const { dispatchCartDropdown, cartCleaner, currency } = this.props;
		alert(`Checked out ${currency + this.getTotal("sum").toFixed(2)}`);
		cartCleaner();
		dispatchCartDropdown(false);
	};

	goToCart = () => {
		const { dispatchCartDropdown, dispatchActiveCategory } = this.props;
		dispatchActiveCategory();
		localStorage.removeItem("activeCategory");
		dispatchCartDropdown(false);
	};

	renderCartItemLabel(item) {
		const { currency } = this.props;
		return (
			<>
				<div className="cart__item--branding">
					<span className="mb-8">{item.brand}</span>
					<span>{item.name}</span>
				</div>
				<span className="cart__item--price">{currency + productPrice(item, currency)}</span>
			</>
		);
	}

	renderCartItemAttributes(item) {
		return (
			<div className="attributes__container">
				{item.attributes.map((attribute, index1) => {
					const isColor = attribute.name === "Color";
					return (
						<div key={index1} className="cartOverlay__attr--container">
							<span>{attribute.name}:</span>
							<div>
								{attribute.items.map((attr, index2) => {
									const isChosen = attr.value === item.chosenAttributes[index1].attrValue;
									return (
										<button
											key={index2}
											className={`cartOverlay__attrValue ${
												isChosen ? (isColor ? "selected--swatch" : "selected") : ''
											}`}
											style={isColor ? { backgroundColor: `${attr.value}` } : {}}
										>
											{isColor ? "" : attr.value}
										</button>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	renderCartItemInfo(item) {
		return (
			<div className="cart__item--info">
				{this.renderCartItemLabel(item)}
				{this.renderCartItemAttributes(item)}
			</div>
		);
	}

	renderCartItemImage(item) {
		const { subOne, addOne } = this.props;
		return (
			<div className="d-flex">
				<div className="cart__item--counter">
					<button onClick={() => addOne(item.id)}>+</button>
					<span>{item.qty}</span>
					<button
						onClick={() => subOne(item.id, item.qty)}
						className={item.qty < 2 ? "btn__opacity" : ""}
					>
						-
					</button>
				</div>
				<div className="cart__item--image">
					<img className="cartOverlay__img" src={item.gallery[0]} alt={item.id} />
					<button className="remove__btn" onClick={() => this.RemoveProduct(item.id)}>
						x
					</button>
				</div>
			</div>
		);
	}

	renderCartItem() {
		const { cartProducts } = this.props;
		return (
			<div className="cart--dropdown__container">
				{cartProducts.map((item, key) => {
					return (
						<div key={key} className="cart__item--container">
							{this.renderCartItemInfo(item)}
							{this.renderCartItemImage(item)}
						</div>
					);
				})}
			</div>
		);
	}

	renderCheckOut() {
		const { cartProducts } = this.props;
		return (
			<div className="cart__btn--container">
				<Link to="/cart">
					<button className="cart__btn--viewBag" onClick={this.goToCart}>
						VIEW BAG
					</button>
				</Link>
				<button
					className="cart__btn--checkOut"
					onClick={() => {
						cartProducts.length ? this.checkOut() : alert("Cart is Empty");
					}}
				>
					CHECK OUT
				</button>
			</div>
		);
	}

	renderCartIcon() {
		return (
			<div className="navbar-cart-logo" onClick={this.toggleClick}>
				<img className="pos-relative" src={cart} alt="cart" />
				<button className="totalQty__btn">{this.getTotal("qty")}</button>
			</div>
		);
	}

	renderCartDropdown() {
		const { toggleCartDropdown, currency, cartProducts } = this.props;
		return (
			<div className={`cart--dropdown ${toggleCartDropdown && "cart-active"}`}>
				<p className="mb-40 fw-500">
					<span className="fw-700">My Bag</span>, {cartProducts.length} items
				</p>
				{this.renderCartItem()}
				<div className="cart__total--amount">
					<span>Total</span>
					<span className="totalAmount">{currency + this.getTotal("sum").toFixed(2)}</span>
				</div>
				{this.renderCheckOut()}
			</div>
		);
	}

	renderCartContent() {
		return (
			<div className="navbar__cart" ref={this.cartDropdownRef}>
				{this.renderCartIcon()}
				{this.renderCartDropdown()}
			</div>
		);
	}

	render() {
		return <>{this.renderCartContent()}</>;
	}
}

const mapStateToProps = (state) => {
	return {
		cartProducts: state.cart.cart,
		currency: state.cart.currency,
		toggleCartDropdown: state.cart.toggleCartDropdown,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addOne: (id) => dispatch(addOne(id)),
		removeFromCart: (id) => dispatch(removeFromCart(id)),
		subOne: (id, value) => dispatch(subOne(id, value)),
		dispatchCartDropdown: (bool) => dispatch(toggleCartDropdown(bool)),
		dispatchCurrencyDropdown: (bool) => dispatch(toggleCurrencyDropdown(bool)),
		dispatchActiveCategory: (category) => dispatch(activeCategory(category)),
		cartCleaner: () => dispatch(cartCleaner()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(NavbarCart);
