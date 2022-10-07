import React, { Component } from "react";
import { connect } from "react-redux";

import { addOne, removeFromCart, subOne, cartCleaner } from "../redux/Cart/cart-action";
import Slider from "../components/Slider";
import { productPrice } from "../helpers/utils";

class Cart extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeImg: [],
		};
	}

	componentDidMount() {
		const { cartProducts } = this.props;
		const imageCopy = [];
		for (let i = 0; cartProducts.length > i; i++) {
			imageCopy.push(0);
			this.setState({ activeImg: imageCopy });
		}
	}

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

	RemoveProduct = (id) => {
		const { removeFromCart } = this.props;
		if (window.confirm("Do you want to remove product?")) {
			removeFromCart(id);
		}
	};

	handleClick = () => {
		const { currency, cartCleaner } = this.props;
		alert(`Checked out ${currency + this.getTotal("sum").toFixed(2)}`);
		cartCleaner();
	};

	renderAttributeValues(item, index, attribute) {
		return (
			<div className="cart_attributes">
				{attribute.items.map((attr, id) => {
					const isColor = attribute.name === "Color";
					const isChosen = attr.value === item.chosenAttributes[index].attrValue;
					return (
						<button
							key={id}
							className={`${isChosen ? (isColor ? "selected--swatch" : "selected") : ""} ${
								isColor ? "btn-32-32" : "btn-63-45 cart__attrValue"
							}`}
							style={isColor ? { backgroundColor: `${attr.value}` } : {}}
						>
							{isColor ? "" : attr.value}
						</button>
					);
				})}
			</div>
		);
	}

	renderAttributes(item) {
		return (
			<div className="cart__item--attributes--container">
				{item.attributes.map((attribute, index) => {
					return (
						<div key={index} className="cart__item--attrs">
							<span className="cart__attrName">{attribute.name}:</span>
							{this.renderAttributeValues(item, index, attribute)}
						</div>
					);
				})}
			</div>
		);
	}

	renderImage(item) {
		const { addOne, subOne } = this.props;
		return (
			<div className="bagCart__item--right">
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
				<Slider images={item.gallery} />
				<button
					className="remove__btn remove__btn--top"
					onClick={() => this.RemoveProduct(item.id)}
				>
					x
				</button>
			</div>
		);
	}

	renderTotalOrder() {
		const { currency } = this.props;
		return (
			<div className="totalOrder">
				<div className="d-flex">
					<div className="totalOrder__nums mr-8">
						<p>Tax 21%: </p>
						<p>Quantity:</p>
						<p>Total: </p>
					</div>
					<div className="totalOrder__nums">
						<span className="mb-8">{currency + (this.getTotal("sum") * 0.21).toFixed(2)}</span>
						<span className="mb-8">{this.getTotal("qty")}</span>
						<span className="mb-8">
							{currency}
							{this.getTotal("sum").toFixed(2)}
						</span>
					</div>
				</div>
				<button className="cart__btn--checkOut OrderSize" onClick={this.handleClick}>
					ORDER
				</button>
			</div>
		);
	}

	renderCartProducts() {
		const { cartProducts, currency } = this.props;
		if (cartProducts.length < 1) {
			return <></>;
		} else {
			return (
				<div>
					{cartProducts.map((item) => {
						return (
							<div key={item.id} className="cart__item--container cart__border">
								<div className="bagCart__item--left">
									<span>{item.brand}</span>
									<span className="cart-item-name">{item.name}</span>
									<span>
										{currency}
										{productPrice(item, currency)}
									</span>
									{this.renderAttributes(item)}
								</div>
								{this.renderImage(item)}
							</div>
						);
					})}
					{this.renderTotalOrder()}
				</div>
			);
		}
	}

	renderCartContent() {
		const { cartProducts } = this.props;
		return (
			<div className="cart__container">
				<div className="category__name">
					<span className="cart-name">{cartProducts.length ? "CART" : "CART IS EMPTY"}</span>
					{this.renderCartProducts()}
				</div>
			</div>
		);
	}

	render() {
		return this.renderCartContent();
	}
}

const mapStateToProps = (state) => {
	return {
		cartProducts: state.cart.cart,
		currency: state.cart.currency,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addOne: (id) => dispatch(addOne(id)),
		removeFromCart: (id) => dispatch(removeFromCart(id)),
		subOne: (id, value) => dispatch(subOne(id, value)),
		cartCleaner: () => dispatch(cartCleaner()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
